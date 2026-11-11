import { Injectable } from '@nestjs/common';
import { NoteStorageAdapter } from './NoteStorageAdapter.js';
import { Note } from './entities/Note.entity.js';

@Injectable()
export class NoteService {
  public constructor(private readonly storageAdapter: NoteStorageAdapter) { }
  
  public async crearNota(nota: Note, userId: string): Promise<Note> {
    return this.storageAdapter.create(nota, userId);
  }

  public async obtenerNotas(userId: string): Promise<Note[]> {
    return this.storageAdapter.findById(userId);
  }
}
