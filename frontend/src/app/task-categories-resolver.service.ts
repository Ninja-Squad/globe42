import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskCategoryModel } from './models/task-category.model';
import { TaskService } from './task.service';

@Injectable({ providedIn: 'root' })
export class TaskCategoriesResolverService implements Resolve<Array<TaskCategoryModel>> {
  constructor(private taskService: TaskService) {}

  resolve(): Observable<Array<TaskCategoryModel>> {
    return this.taskService.listCategories();
  }
}
