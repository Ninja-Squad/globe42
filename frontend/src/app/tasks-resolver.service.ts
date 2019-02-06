import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TaskModel } from './models/task.model';
import { Observable } from 'rxjs';
import { TaskService } from './task.service';
import { Page } from './models/page';

@Injectable({ providedIn: 'root' })
export class TasksResolverService implements Resolve<Array<TaskModel> | Page<TaskModel>> {

  constructor(private taskService: TaskService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Page<TaskModel>> {
    const listType = route.data.taskListType;
    const pageNumber = route.queryParamMap.get('page') ? +route.queryParamMap.get('page') : 0;

    switch (listType) {
      case 'todo':
        return this.taskService.listTodo(pageNumber);
      case 'urgent':
        return this.taskService.listUrgent(pageNumber);
      case 'mine':
        return this.taskService.listMine(pageNumber);
      case 'unassigned':
        return this.taskService.listUnassigned(pageNumber);
      case 'archived':
        return this.taskService.listArchived(pageNumber);
      case 'person-todo':
        return this.taskService.listTodoForPerson(route.parent.parent.data.person.id, pageNumber);
      case 'person-archived':
        return this.taskService.listArchivedForPerson(route.parent.parent.data.person.id, pageNumber);
      default:
        throw new Error(`Unknown listType: ${listType}`);
    }
  }
}
