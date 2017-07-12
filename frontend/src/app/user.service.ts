import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';
import { Observable } from 'rxjs/Observable';
import { UserCommand } from './models/user.command';
import { UserWithPasswordModel } from './models/user-with-password.model';

@Injectable()
export class UserService {

  userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: Http, private requestOptions: RequestOptions) {
    this.retrieveUser();
  }

  authenticate(credentials: { login: string; password: string }) {
    return this.http.post('/api/authentication', credentials)
      .map(response => response.json())
      .do(user => this.storeLoggedInUser(user));
  }

  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.requestOptions.headers.set('Authorization', `Bearer ${user.token}`);
    this.userEvents.next(user);
  }

  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user: UserModel = JSON.parse(value);
      this.requestOptions.headers.set('Authorization', `Bearer ${user.token}`);
      this.userEvents.next(user);
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
    this.requestOptions.headers.delete('Authorization');
  }

  isLoggedIn(): boolean {
    return !!window.localStorage.getItem('rememberMe');
  }

  checkPassword(password: string): Observable<void> {
    return this.http.post('/api/authentication', {login: this.userEvents.getValue().login, password})
      .map(() => null);
  }

  changePassword(newPassword: string): Observable<void> {
    return this.http.put('/api/users/me/passwords', {newPassword})
      .map(() => null);
  }

  list(): Observable<Array<UserModel>> {
    return this.http.get('/api/users').map(response => response.json());
  }

  create(command: UserCommand): Observable<UserWithPasswordModel> {
    return this.http.post('/api/users', command).map(response => response.json());
  }

  get(id: number): Observable<UserModel> {
    return this.http.get(`/api/users/${id}`).map(response => response.json());
  }

  update(id: number, user: UserCommand): Observable<void> {
    return this.http.put(`/api/users/${id}`, user).map(() => null);
  }

  resetPassword(id: number): Observable<UserWithPasswordModel> {
    return this.http.post(`/api/users/${id}/password-resets`, null).map(response => response.json());
  }
}
