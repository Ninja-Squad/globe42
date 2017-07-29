import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TaskModel } from './models/task.model';
import { NowService } from './now.service';
import { Page } from './models/page';
import { UserService } from './user.service';

@Injectable()
export class TaskService {

  constructor(private http: HttpClient,
              private nowService: NowService,
              private userService: UserService) { }

  listTodo(): Observable<Array<TaskModel>> {
    return this.http.get('/api/tasks');
  }

  listUrgent(): Observable<Array<TaskModel>> {
    return this.http.get('/api/tasks', {
      params: new HttpParams().set('before', this.nowService.now().add(7, 'd').format('YYYY-MM-DD'))
    });
  }

  listMine(): Observable<Array<TaskModel>> {
    return this.http.get('/api/tasks?mine');
  }

  listForPerson(personId: number): Observable<Array<TaskModel>> {
    return this.http.get(`/api/tasks?person=${personId}`);
  }

  listUnassigned(): Observable<Array<TaskModel>> {
    return this.http.get(`/api/tasks?unassigned`);
  }

  listArchived(pageNumber: number): Observable<Page<TaskModel>> {
    return this.http.get('/api/tasks', {params: new HttpParams().set('archived', '').set('page', pageNumber.toString())});
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
}
