import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Note } from '../Note/entities/Note.entity.js';
import { User } from '../User/entities/User.entity.js';

@Injectable()
export class JsonDb {
  private readonly dbPath = join(process.cwd(), 'db');
}