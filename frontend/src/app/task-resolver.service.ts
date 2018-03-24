import { Injectable } from '@angular/core';
import { TaskModel } from './models/task.model';
import { TaskService } from './task.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskResolverService implements Resolve<TaskModel> {

  constructor(private taskService: TaskService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<TaskModel> {
    return this.taskService.get(+route.paramMap.get('id'));
  }
}
