import { Link } from "react-router-dom";
import { getStoredNotes } from "~/data/notes";

import { useLoaderData } from "@remix-run/react";

import styles from "~/styles/note-details.css";
import { json } from "@remix-run/node";

export default function noteDetailsPage() {
    const note = useLoaderData();

    return (
        <main id="note-details">
            <header>
                <nav><Link to="/">Back to all notes</Link></nav>
                <h1>{note.title}</h1>
                <p>{note.content}</p>
            </header>
            <p id="note-detials-content">

            </p>
        </main>
    )
}

export async function loader({ params }) {
    const notes = await getStoredNotes();
    const noteId = params.noteId;
    const selectedNote = notes.find(note => note.id === noteId);

    if (!selectedNote) {
        throw json({ message: 'Note not note for id: ' + noteId }, { status: 404 });
    }

    return selectedNote;

}

export function meta({ data }) {
    return {
        title: data.title,
        description: data.content.slice(0, 150)
    }
}

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}