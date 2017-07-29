import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TaskModel } from './models/task.model';
import { Observable } from 'rxjs/Observable';
import { TaskService } from './task.service';

@Injectable()
export class TasksResolverService implements Resolve<Array<TaskModel>> {

  constructor(private taskService: TaskService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<TaskModel>> {
    const listType = route.data['taskListType'];
    switch (listType) {
      case 'todo':
        return this.taskService.listTodo();
      case 'urgent':
        return this.taskService.listUrgent();
      case 'mine':
        return this.taskService.listMine();
      case 'unassigned':
        return this.taskService.listUnassigned();
      case 'person':
        return this.taskService.listForPerson(route.parent.data['person'].id);
      default:
        throw new Error(`Unknown listType: ${listType}`);
    }
  }
}
