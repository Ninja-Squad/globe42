import { UserModel } from './user.model';
import { PersonIdentityModel } from './person.model';
import { TaskCategoryModel } from './task-category.model';

export interface TaskModel {
  id: number;
  description: string;
  title: string;
  category: TaskCategoryModel;
  dueDate: string;
  status: 'TODO' | 'DONE' | 'CANCELLED';
  assignee: UserModel;
  creator: UserModel;
  concernedPerson: PersonIdentityModel;
  totalSpentTimeInMinutes: number;
}
