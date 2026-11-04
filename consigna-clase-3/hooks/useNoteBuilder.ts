import { useState, useEffect } from "react";
import { Note } from "@/lib/Notas";

export default function useNoteBuilder(username: string){
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        loadNotes(username);
    }, [username]);

    async function loadNotes(username: string) {
        await fetch("@/app/api/note", {
            method: "GET",
            body: username
        }).then((response) => {
            if (!response.ok)
                throw Error("La API falló")
            return response.json();
        }).then((data) => {
            setNotes(data);
        }).catch(e => {
            setError(e.message);
        }).finally(() => {
            setReady(true);
        });
    }

    async function addNote(note: Note) {
        await fetch("@/app/api/note", {
            method: "POST",
            body: JSON.stringify(note)
        }).then((response) => {
            if (!response.ok)
                throw Error("La API falló")
        }).then(() => {
            setError(null);
            setNotes([...notes!, note]);
        }).catch(e => {
            setError(e.message);
        });
    }

    async function editNote(note: Note) {
        const id = note.id;
        await fetch(`@/app/api/note/${id}`, {
            method: "PUT",
            body: JSON.stringify(note)
        }).then((response) => {
            if (!response.ok)
                throw Error("La API falló")
        }).then(() => {
            setError(null);
            setNotes(notes.map((n) => (n.id === id ? note : n)));
        }).catch(e => {
            setError(e.message);
        });
    }

    async function deleteNote(id: number) {
        await fetch(`@/app/api/note/${id}`, {
            method: "DELETE"
        }).then((response) => {
            if (!response.ok)
                throw Error("La API falló")
        }).then(() => {
            setError(null);
            setNotes(notes.filter((n) => n.id !== id));
        }).catch(e => {
            setError(e.message);
        });
    }

    return {
        notes,
        error,
        ready,
        addNote,
        editNote,
        deleteNote
    }
}