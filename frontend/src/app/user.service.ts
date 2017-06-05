import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { UserModel } from './models/user.model';
import { Http } from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  get(id: number): Observable<UserModel> {
    return this.http.get(`/api/persons/${id}`).map(response => response.json());
  }

  update(user: UserModel): Observable<any> {
    return this.http.put(`/api/persons/${user.id}`, user);
  }

  create(user: UserModel): Observable<UserModel> {
    return this.http.post(`/api/persons`, user).map(response => response.json());
  }

  list(): Observable<Array<UserModel>> {
    return this.http.get('/api/persons').map(response => response.json());
  }

}
