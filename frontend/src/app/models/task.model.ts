import { UserModel } from './user.model';
import { PersonIdentityModel } from './person.model';

export interface TaskModel {
  id: number;
  description: string;
  title: string;
  dueDate: string;
  status: 'TODO' | 'DONE' | 'CANCELLED';
  assignee: UserModel;
  creator: UserModel;
  concernedPerson: PersonIdentityModel;
}
