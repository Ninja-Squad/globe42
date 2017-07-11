export interface UserModel {
  id: number;
  login: string;
  admin: boolean;
  token?: string;
}
