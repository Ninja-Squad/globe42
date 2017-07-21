import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';
import { Observable } from 'rxjs/Observable';
import { UserCommand } from './models/user.command';
import { UserWithPasswordModel } from './models/user-with-password.model';
import { JwtInterceptorService } from './jwt-interceptor.service';

@Injectable()
export class UserService {

  userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient, jwtInterceptor: JwtInterceptorService) {
    this.userEvents.subscribe(user => {
      jwtInterceptor.token = user ? user.token : null;
    });
    this.retrieveUser();
  }

  authenticate(credentials: { login: string; password: string }) {
    return this.http.post<UserModel>('/api/authentication', credentials)
      .do(user => this.storeLoggedInUser(user));
  }

  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user: UserModel = JSON.parse(value);
      this.userEvents.next(user);
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
  }

  isLoggedIn(): boolean {
    return !!window.localStorage.getItem('rememberMe');
  }

  checkPassword(password: string): Observable<void> {
    return this.http.post<void>('/api/authentication', {login: this.userEvents.getValue().login, password});
  }

  changePassword(newPassword: string): Observable<void> {
    return this.http.put<void>('/api/users/me/passwords', {newPassword});
  }

  list(): Observable<Array<UserModel>> {
    return this.http.get('/api/users');
  }

  create(command: UserCommand): Observable<UserWithPasswordModel> {
    return this.http.post('/api/users', command);
  }

  get(id: number): Observable<UserModel> {
    return this.http.get(`/api/users/${id}`);
  }

  update(id: number, user: UserCommand): Observable<void> {
    return this.http.put<void>(`/api/users/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }

  resetPassword(id: number): Observable<UserWithPasswordModel> {
    return this.http.post(`/api/users/${id}/password-resets`, null);
  }
}
