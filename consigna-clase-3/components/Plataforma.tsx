import { useState } from "react";
import { Note } from "../lib/Notas";
import { Nota } from "./Nota";

/**
 * Una plataforma es un conjunto de todas las notas
 * @param props Objeto con la lista de notas.
 * @returns HTML con la plataforma de notas.
 */
export default function Plataforma(props: {notes: Note[];
    ready: boolean;
    editingId: number | null;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;}) {
    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div className="flex flex-col items-center p-4">
                <h1 className="text-4xl font-bold">Plataforma de Notas</h1>
                <p className="mt-4 text-lg text-white">Crea y administra tus notas de manera sencilla.</p>
            </div>
            {!props.ready ? (
                "Cargando notas..."
            ) : props.notes.length === 0 ? (
                "No hay notas para mostrar."
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {props.notes.map((note) => (
                        <Nota key={note.id}
                            nota={note}
                            onEditar={() => props.onEdit(note)}
                            onEliminar={() => props.onDelete(note.id)}
                            seleccionada={props.editingId === note.id}
                        />))
                    }
                </div>
            )}
        </div>
    );
}