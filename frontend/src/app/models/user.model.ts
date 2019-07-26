export interface UserModel {
  id: number;
  login: string;
  admin: boolean;
  token?: string;
}

export interface ProfileModel extends UserModel {
  email: string;
  taskAssignmentEmailNotificationEnabled: boolean;
}

export interface ProfileCommand {
  email: string;
  taskAssignmentEmailNotificationEnabled: boolean;
}
