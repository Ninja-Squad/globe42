import { UserModel } from './user.model';

export interface UserWithPasswordModel extends UserModel {
  generatedPassword: string;
}
