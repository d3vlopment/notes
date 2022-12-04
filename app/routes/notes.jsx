import { json, redirect } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";

import NewNote, { links as newNoteStyles } from "~/components/NewNote";
import NoteList, { links as noteListStyles } from "~/components/NoteList";

import { getStoredNotes, storeNotes } from "~/data/notes";



export default function NotesPage() {

    const notes = useLoaderData();

    return (
        <div>
            <NewNote />
            <NoteList notes={notes} />
        </div>
    )
}

export async function loader() {
    const notes = await getStoredNotes();

    if (!notes || notes.length === 0) {
        throw json({ message: 'No notes found' }, { status: 404 });
    }
    return notes;
}

export async function action({ request }) {

    // get the form data
    const formData = await request.formData();

    // here we can get the entries from each field
    const noteData = Object.fromEntries(formData);

    if (noteData.title.trim().length < 5) {
        return { message: "Title must be at least 5 characters long" }
    }
    // we could also add validation here
    // add note to existing notes
    // first get existing notes
    const existingNotes = await getStoredNotes();

    // add new id to new note
    noteData.id = new Date().toISOString();

    // we can then update the notes
    const updatedNotes = existingNotes.concat(noteData);

    // we are not retung a valu we want to store the data
    await storeNotes(updatedNotes);

    // redirect to the notes page
    return redirect("/notes");


}

export function links() {
    return [...newNoteStyles(), ...noteListStyles()];
}

export function meta() {
    return {
        title: "Notes",
        description: "A list of notes"
    }
}

export function CatchBoundary() {
    const caughtResponse = useCatch();
    const message = caughtResponse.data?.message || "Data not found";
    return (
        <main>
            <NewNote />
            <p className="info-message">{message}</p>
        </main>
    )
}

export function ErrorBoundary({ error }) {
    return (
        <main className="error">
            <h1>An error related to your notes occured</h1>
            <p>{error.message}</p>
        </main>)
}