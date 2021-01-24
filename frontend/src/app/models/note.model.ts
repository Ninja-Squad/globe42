import { UserModel } from './user.model';

export const NOTE_CATEGORIES = ['APPOINTMENT', 'OTHER'];
export type NoteCategory = typeof NOTE_CATEGORIES[number];

export interface NoteModel {
  id: number;
  text: string;
  creator: UserModel;
  creationInstant: string;
  category: NoteCategory;
}

export interface NoteCommand {
  text: string;
  category: NoteCategory;
}
