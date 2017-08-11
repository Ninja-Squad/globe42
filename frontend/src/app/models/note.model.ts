import { UserModel } from './user.model';

export interface NoteModel {
  id: number;
  text: string;
  creator: UserModel;
  creationInstant: string;
}
