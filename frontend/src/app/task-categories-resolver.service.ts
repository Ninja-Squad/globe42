import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TaskCategoryModel } from './models/task-category.model';
import { TaskService } from './task.service';

@Injectable()
export class TaskCategoriesResolverService implements Resolve<Array<TaskCategoryModel>> {

  constructor(private taskService: TaskService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<TaskCategoryModel>> {
    return this.taskService.listCategories();
  }

}
