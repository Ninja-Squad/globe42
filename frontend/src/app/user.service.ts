import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';
import { Observable } from 'rxjs/Observable';
import { UserCommand } from './models/user.command';
import { UserWithPasswordModel } from './models/user-with-password.model';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  list(): Observable<Array<UserModel>> {
    return this.http.get<Array<UserModel>>('/api/users');
  }

  create(command: UserCommand): Observable<UserWithPasswordModel> {
    return this.http.post<UserWithPasswordModel>('/api/users', command);
  }

  get(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`/api/users/${id}`);
  }

  update(id: number, user: UserCommand): Observable<void> {
    return this.http.put<void>(`/api/users/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }

  resetPassword(id: number): Observable<UserWithPasswordModel> {
    return this.http.post<UserWithPasswordModel>(`/api/users/${id}/password-resets`, null);
  }
}
