import { convertirNotasAlmacenadas, expiraEn, Note, STORAGE_KEY } from "@/lib/Notas";
import { useEffect, useState } from "react";
import Plataforma from "./Plataforma";
import Formulario from "./Formulario";

export default function NoteApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

    useEffect(() => {
        const storedNotes = localStorage.getItem(STORAGE_KEY);
        if (storedNotes) {
            setNotes(convertirNotasAlmacenadas(storedNotes));
        }
        setReady(true);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <Plataforma
                notes={notes}
                ready={ready}
                editingId={editingId}
                onEdit={(note) => setEditingId(note.id)}
                onDelete={(id) => {
                    setNotes(notes.filter((note) => note.id !== id));
                    if (editingId === id) {
                        setEditingId(null);
                    }
                }}
            />
            {editingId !== null ? (
                <Formulario
                    editar={true}
                    tituloInicial={notes.find((n) => n.id === editingId)?.title ?? ""}
                    textoInicial={notes.find((n) => n.id === editingId)?.text ?? ""}
                    colorDeFondoInicial=""
                    minutosDeValidezInicial={expiraEn(notes.find((n) => n.id === editingId) as Note) / 60000}
                    onSubmit={(values) => {
                        const note = notes.find((n) => n.id === editingId);

                        if (!note) return;

                        note.title = values.title;
                        note.text = values.text;
                        note.minutes = values.minutes;
                        note.color = values.color;

                        setNotes([...notes]);
                        setEditingId(null);
                    }}
                    onCancelar={() => {
                        setEditingId(null);
                    }}
                />
            ): <Formulario
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
                            createdAt: Date.now(),
                            notified: false,
                            color: values.color,
                        }

                        setNotes([...notes]);
                    }}
                    onCancelar={() => {}}
                />}
        </div>
    );
}