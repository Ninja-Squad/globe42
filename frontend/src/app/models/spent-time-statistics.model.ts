import { TaskCategoryModel } from './task-category.model';
import { UserModel } from './user.model';

export interface SpentTimeStatisticsModel {
  statistics: Array<SpentTimeStatisticModel>;
}

export interface SpentTimeStatisticModel {
  category: TaskCategoryModel;
  user: UserModel;
  minutes: number;
}
