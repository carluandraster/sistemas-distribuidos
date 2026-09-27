export type Note = {
  id: number;
  title: string;
  text: string;
  minutes: number;
  createdAt: number;
  notified: boolean;
  color: string;
};

export const STORAGE_KEY = "clase3-notas";

/**
 * Convierte las notas almacenadas en localStorage a un array de objetos Note.
 * 
 * @param rawNotes Las notas almacenadas en localStorage como string.
 * @returns Un array de objetos Note.
 */
export function convertirNotasAlmacenadas(rawNotes: string | null): Note[] {
  if (!rawNotes) {
    return [];
  }
  try {
    const parsed = JSON.parse(rawNotes);
    if (Array.isArray(parsed)) {
      return parsed.map((note) => ({
        id: note.id as number,
        title: note.title as string,
        text: note.text as string,
        minutes: note.minutes as number,
        createdAt: note.createdAt as number,
        notified: note.notified as boolean,
        color: note.color as string,
      }));
    }
  } catch {
    // Ignore JSON parse errors
  }
  return [];
}

export function expiraEn(nota: Note): number {
  const expirationTime = nota.createdAt + nota.minutes * 60 * 1000;
  return expirationTime - Date.now();
}

export function estaExpirada(nota: Note): boolean {
  return expiraEn(nota) <= 0;
}