import * as mongoose from 'mongoose';

export interface Agenda extends mongoose.Document {
  id: string;
}

const AgendaSchema: mongoose.Schema = new mongoose.Schema({});

export const AgendaModel = mongoose.model<Agenda>(
  'Agenda',
  AgendaSchema,
  'agendaJobs'
);
