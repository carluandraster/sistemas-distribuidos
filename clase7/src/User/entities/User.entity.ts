import { Note } from "../../Note/entities/Note.entity.js";

export type User = {
    username: string;
    password: string;
    notes: Note[];
}