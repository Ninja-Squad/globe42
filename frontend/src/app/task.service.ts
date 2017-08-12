import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TaskModel } from './models/task.model';
import { NowService } from './now.service';
import { Page } from './models/page';
import { UserService } from './user.service';
import { TaskCommand } from './models/task.command';

function pageParams(pageNumber: number): HttpParams {
  return new HttpParams().set('page', pageNumber.toString());
}

@Injectable()
export class TaskService {

  constructor(private http: HttpClient,
              private nowService: NowService,
              private userService: UserService) { }

  listTodo(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {params: pageParams(pageNumber)});
  }

  listUrgent(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {
      params: pageParams(pageNumber).set('before', this.nowService.now().add(7, 'd').format('YYYY-MM-DD'))
    });
  }

  listMine(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {params: pageParams(pageNumber).set('mine', '')});
  }

  listForPerson(personId: number, pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>(`/api/tasks`, {params: pageParams(pageNumber).set('person', personId.toString())});
  }

  listUnassigned(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>(`/api/tasks`, {params: pageParams(pageNumber).set('unassigned', '')});
  }

  listArchived(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get<Page<TaskModel>>('/api/tasks', {params: pageParams(pageNumber).set('archived', '')});
  }

  assignToSelf(taskId: number): Observable<void> {
    const userId = this.userService.userEvents.getValue().id;
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
}
