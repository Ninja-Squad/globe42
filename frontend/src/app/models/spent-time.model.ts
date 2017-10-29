import { UserModel } from './user.model';

export interface SpentTimeModel {
  id: number;
  minutes: number;
  creator: UserModel;
  creationInstant: string;
}
