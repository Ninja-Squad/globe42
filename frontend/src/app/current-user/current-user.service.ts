import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { JwtInterceptorService } from './jwt-interceptor.service';

@Injectable()
export class CurrentUserService {
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
    document.cookie = `globe42_token=${user.token};path=/`;
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
    document.cookie = `globe42_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
}
