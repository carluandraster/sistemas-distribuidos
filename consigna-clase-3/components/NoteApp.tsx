import { expiraEn, Note } from "@/lib/Notas";
import { useState } from "react";
import useNoteBuilder from "@/hooks/useNoteBuilder";
import useWatch from "@/hooks/useWatch";
import Plataforma from "./Plataforma";
import Formulario from "./Formulario";
import useNotifications from "@/hooks/useNotifications";



export default function NoteApp() {
    const [editingId, setEditingId] = useState<number | null>(null);
    const now = useWatch();
    const { notes, error, ready,
        addNote, editNote, deleteNote
    } = useNoteBuilder("usuario"); // Reemplaza "usuario" con el nombre de usuario real
    useNotifications(now, ready, notes);

    return (
        <div className="flex min-h-screen flex-col items-center gap-4 p-4">
            {error && <div className="text-red-500">{error}</div>}
            <Plataforma
                notes={notes}
                ready={ready}
                editingId={editingId}
                onEdit={(note) => setEditingId(note.id)}
                onDelete={(id) => {
                    deleteNote(id);
                }}
            />
            {editingId !== null ? (
                <Formulario
                    editar={true}
                    tituloInicial={(notes.find((n) => n.id === editingId) as Note).title}
                    textoInicial={(notes.find((n) => n.id === editingId) as Note).text}
                    colorDeFondoInicial={(notes.find((n) => n.id === editingId) as Note).color}
                    minutosDeValidezInicial={Math.max(1, Math.round(expiraEn(notes.find((n) => n.id === editingId) as Note) / 60000))}
                    onSubmit={(values) => {
                        const note = notes.find((n) => n.id === editingId);

                        if (!note) return;

                        note.title = values.title;
                        note.text = values.text;
                        note.minutes = values.minutes;
                        note.color = values.color;

                        editNote({
                            id: note.id,
                            title: note.title,
                            text: note.text,
                            minutes: note.minutes,
                            createdAt: now,
                            notified: false,
                            color: note.color,
                        });
                    }}
                    onCancelar={() => {
                        setEditingId(null);
                    }}
                />
            ) : <Formulario
                editar={false}
                tituloInicial={""}
                textoInicial={""}
                colorDeFondoInicial=""
                minutosDeValidezInicial={0}
                onSubmit={(values) => {
                    const note = {
                        id: Date.now(),
                        title: values.title,
                        text: values.text,
                        minutes: values.minutes,
                        createdAt: now,
                        notified: false,
                        color: values.color,
                    }

                    addNote(note);
                }}
                onCancelar={() => { }}
            />}
        </div>
    );
}