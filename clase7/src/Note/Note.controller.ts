import { Controller, Get, Param, Post} from '@nestjs/common';
import { NoteService } from './Note.service.js';
import type { Note } from './entities/Note.entity.js';

@Controller("notes")
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post(':note')
  public async createNote(
    @Param('note') note: Note,
    @Param('user') user: string,
  ) {
    return await this.noteService.crearNota(note, user);
  }
}