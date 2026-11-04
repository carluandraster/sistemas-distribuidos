import { Note, estaExpirada } from "@/lib/Notas";
import { useEffect, useState } from "react";

export default function useNotifications(now: number, ready: boolean, notes: Note[]) {
    const notificacionesMandadas: Set<number> = new Set();
    useEffect(() => {
        if (ready && now !== 0 && typeof Notification !== "undefined" && Notification.permission === "granted") {
            notes.forEach((note: Note) => {
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
}