import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskModel } from './models/task.model';
import { Page } from './models/page';
import { TaskCommand } from './models/task.command';
import { SpentTimeModel } from './models/spent-time.model';
import { Comparator, sortBy } from './utils';
import { TaskCategoryModel } from './models/task-category.model';
import { CurrentUserService } from './current-user/current-user.service';
import { SpentTimeStatisticsCriteria } from './models/spent-time-statistics.criteria';
import { SpentTimeStatisticsModel } from './models/spent-time-statistics.model';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

function pageParams(pageNumber: number): HttpParams {
  return new HttpParams().set('page', pageNumber.toString());
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  constructor(private http: HttpClient,
              private currentUserService: CurrentUserService) { }

  listTodo(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {params: pageParams(pageNumber)});
  }

  listUrgent(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {
      params: pageParams(pageNumber).set('before', DateTime.local().plus({ days: 7 }).toISODate())
    });
  }

  listMine(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {params: pageParams(pageNumber).set('mine', '')});
  }

  listTodoForPerson(personId: number, pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>(`/api/tasks`, {params: pageParams(pageNumber).set('person', personId.toString())});
  }

  listArchivedForPerson(personId: number, pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>(
      `/api/tasks`,
      {params: pageParams(pageNumber).set('person', personId.toString()).set('archived', '')});
  }

  listUnassigned(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>(`/api/tasks`, {params: pageParams(pageNumber).set('unassigned', '')});
  }

  listArchived(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {params: pageParams(pageNumber).set('archived', '')});
  }

  assignToSelf(taskId: number): Observable<void> {
    const userId = this.currentUserService.userEvents.getValue().id;
    return this.http.post<void>(`/api/tasks/${taskId}/assignments`, {userId});
  }

  markAsDone(taskId: number): Observable<void> {
    return this.http.post<void>(`/api/tasks/${taskId}/status-changes`, {newStatus: 'DONE'});
  }

  cancel(taskId: number): Observable<void> {
    return this.http.post<void>(`/api/tasks/${taskId}/status-changes`, {newStatus: 'CANCELLED'});
  }

  resurrect(taskId: number): Observable<void> {
    return this.http.post<void>(`/api/tasks/${taskId}/status-changes`, {newStatus: 'TODO'});
  }

  unassign(taskId: number): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${taskId}/assignments`);
  }

  create(command: TaskCommand): Observable<TaskModel> {
    return this.http.post<TaskModel>('/api/tasks', command);
  }

  update(id: number, command: TaskCommand): Observable<void> {
    return this.http.put<void>(`/api/tasks/${id}`, command);
  }

  get(id: number): Observable<TaskModel> {
    return this.http.get<TaskModel>(`/api/tasks/${id}`);
  }

  listSpentTimes(taskId: number): Observable<Array<SpentTimeModel>> {
    return this.http.get<Array<SpentTimeModel>>(`/api/tasks/${taskId}/spent-times`).pipe(
      map(list => sortBy(list, Comparator.comparing<SpentTimeModel>(spentTime => spentTime.creationInstant).reversed()))
    );
  }

  deleteSpentTime(taskId: number, spentTimeId: number): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${taskId}/spent-times/${spentTimeId}`);
  }

  addSpentTime(taskId: number, minutes: number): Observable<SpentTimeModel> {
    return this.http.post<SpentTimeModel>(`/api/tasks/${taskId}/spent-times`, { minutes });
  }

  listCategories(): Observable<Array<TaskCategoryModel>> {
    return this.http.get<Array<TaskCategoryModel>>('/api/task-categories').pipe(
      map(categories => sortBy(categories, c => c.name))
    );
  }

  spentTimeStatistics(criteria: SpentTimeStatisticsCriteria): Observable<SpentTimeStatisticsModel> {
    let params = new HttpParams();
    for (const key of Object.keys(criteria)) {
      const criterion: string = (criteria as any)[key];
      if (criterion) {
        params = params.set(key, criterion);
      }
    }

    return this.http.get<SpentTimeStatisticsModel>('/api/task-statistics/spent-times', { params });
  }
}
