import { UserModel } from './user.model';

export type NoteCategory = 'APPOINTMENT' | 'OTHER';

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
