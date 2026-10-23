import { Controller, Get } from '@nestjs/common';
import { NoteService } from './Note.service.js';

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  getHello(): string {
    return this.noteService.getHello();
  }
}
