import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { NoteController } from './Note.controller.js';
import { NoteService } from './Note.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  // imports: [
  //   ObserveModule.forRoot({
  //     appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
  //     appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
  //     serviceId: 'clase7',
  //   }),
  // ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
