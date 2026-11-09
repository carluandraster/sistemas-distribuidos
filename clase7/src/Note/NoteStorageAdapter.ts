import { IStorageAdapter } from "../database/IStorageAdapter.js";
import { JsonDb } from "../database/json-db.js";
import { Note } from "./entities/Note.entity.js";

/**
 * # NoteStorageAdapter
 * 
 * Adaptador de almacenamiento para notas
 * 
 * ## Constructor
 * 
 * - `db`: instancia de la base de datos JSON
 * 
 * ## Métodos
 * 
 * - `findById(id: string): Promise<Note[]>`: busca notas por ID de usuario
 * - `create(item: Note, author: string): Promise<Note>`: crea una nueva nota para un usuario
 * - `update(id: number, data: Partial<Note>, author: string): Promise<Note>`: actualiza una nota existente
 * - `delete(id: number, author: string): Promise<boolean>`: elimina una nota existente
 */
export class NoteStorageAdapter /*implements IStorageAdapter<Note>*/ {
    public constructor(private readonly db: JsonDb) { }

    /**
     * Busca notas por ID de usuario
     * @param id ID del usuario
     * @returns Notas del usuario
     */
    public async findById(id: string): Promise<Note[]> {
        return this.db.read().then(
            (db) => db.users
                .filter((user) => user.username === id)
                .flatMap((user) => user.notes)
        );
    }

    /**
     * Crea una nueva nota para un usuario
     * @param item Nueva nota a crear
     * @param author Usuario que crea la nota
     * @returns Nota creada
     */
    public async create(item: Note, author: string): Promise<Note> {
        return this.db.update((db) => {
            const user = db.users.find((user) => user.username === author);
            if (!user) {
                throw new Error("User not found");
            }
            user.notes.push(item);
            return item;
        });
    }

    /**
     * Actualiza una nota existente
     * @param id ID de la nota a actualizar
     * @param data Datos a actualizar
     * @param author Usuario que actualiza la nota
     * @returns Nota actualizada
     */
    public async update(id: number, data: Partial<Note>, author: string): Promise<Note> {
        return this.db.update((db) => {
            const user = db.users.find((user) => user.username === author);
            if (!user) {
                throw new Error("User not found");
            }
            const note = user.notes.find((note) => note.id === id);
            if (!note) {
                throw new Error("Note not found");
            }
            Object.assign(note, data);
            return note;
        });
    }

    /**
     * Elimina una nota existente
     * @param id ID de la nota a eliminar
     * @param author Usuario que elimina la nota
     * @returns True si la nota fue eliminada, false si no se encontró la nota
     * @throws Error si el usuario no existe
     */
    public async delete(id: number, author: string): Promise<boolean> {
        return this.db.update((db) => {
            const user = db.users.find((user) => user.username === author);
            if (!user) {
                throw new Error("User not found");
            }
            const noteIndex = user.notes.findIndex((note) => note.id === id);
            if (noteIndex === -1) {
                return false;
            }
            user.notes.splice(noteIndex, 1);
            return true;
        });
    }
    
}