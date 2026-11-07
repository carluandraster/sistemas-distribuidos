import { IStorageAdapter } from "../database/IStorageAdapter.js";
import { JsonDb } from "../database/json-db.js";
import { Note } from "./entities/Note.entity.js";

export class NoteStorageAdapter /*implements IStorageAdapter<Note>*/ {
    public constructor(private readonly db: JsonDb) { }

    public async findById(id: string): Promise<Note[]> {
        return this.db.read().then(
            (db) => db.users
                .filter((user) => user.username === id)
                .flatMap((user) => user.notes)
        );
    }
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
    public async update(id: string, data: Partial<Note>, author: string): Promise<Note | null> {
        throw new Error("Method not implemented.");
    }
    public async delete(id: string, author: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}