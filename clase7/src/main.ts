import { NestFactory } from '@nestjs/core';
import { NoteModule, ObserveInstrument } from './Note/Note.module.js';

async function bootstrap() {
  const app = await NestFactory.create(NoteModule, {
    instrument: ObserveInstrument,
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
