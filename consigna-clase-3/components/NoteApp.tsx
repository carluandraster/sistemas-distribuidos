import { convertirNotasAlmacenadas, estaExpirada, expiraEn, Note, STORAGE_KEY } from "@/lib/Notas";
import { useEffect, useState } from "react";
import Plataforma from "./Plataforma";
import Formulario from "./Formulario";

const notificacionesMandadas: Set<number> = new Set();

export default function NoteApp() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [ready, setReady] = useState(false);
    const [now, setNow] = useState(0);

    // Cargar notas desde localStorage al montar el componente
    useEffect(() => {
        const storedNotes = localStorage.getItem(STORAGE_KEY);
        if (storedNotes) {
            setNotes(convertirNotasAlmacenadas(storedNotes));
        }
        setReady(true);
        setNow(Date.now());
    }, []);

    // Reloj
    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    // Notificaciones
    useEffect(() => {
        if (ready && now !== 0 && typeof Notification !== "undefined" && Notification.permission === "granted") {
            notes.forEach((note) => {
                if (estaExpirada(note) && !note.notified && !notificacionesMandadas.has(note.id)) {
                    new Notification(`Recordatorio: ${note.title}`, {
                    body: note.text
                        ? `${note.text} — se cumplieron ${note.minutes} min de validez.`
                        : `Se cumplieron ${note.minutes} min de validez.`,
                    });
                    notificacionesMandadas.add(note.id);
                    note.notified = true;
                }
            });
        }
    }, [notes, now, ready]);

    return (
        <div className="flex min-h-screen flex-col items-center gap-4 p-4">
            <Plataforma
                notes={notes}
                ready={ready}
                editingId={editingId}
                onEdit={(note) => setEditingId(note.id)}
                onDelete={(id) => {
                    const updatedNotes = notes.filter((note) => note.id !== id);
                    setNotes(updatedNotes);
                    if (editingId === id) {
                        setEditingId(null);
                    }
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
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

                        const updatedNotes = [...notes];
                        setNotes(updatedNotes);
                        setEditingId(null);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
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

                        const updatedNotes = [...notes, note];
                        setNotes(updatedNotes);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
                    }}
                    onCancelar={() => {}}
                />}
        </div>
    );
}