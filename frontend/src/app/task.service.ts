import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TaskModel } from './models/task.model';
import * as moment from 'moment';

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) { }

  listTodo(): Observable<Array<TaskModel>> {
    return this.http.get('/api/tasks');
  }

  listUrgent(): Observable<Array<TaskModel>> {
    return this.http.get('/api/tasks', {
      params: new HttpParams().set('before', moment().add(7, 'd').format('YYYY-MM-DD'))
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
}
