import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { tap } from 'rxjs/operators';
import { CredentialsCommand } from '../models/credentials.command';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient, jwtInterceptor: JwtInterceptorService) {
    this.userEvents.subscribe(user => {
      jwtInterceptor.token = user ? user.token : null;
    });
    this._retrieveUser();
  }

  authenticate(credentials: CredentialsCommand): Observable<UserModel> {
    return this.http.post<UserModel>('/api/authentication', credentials).pipe(
      tap(user => this.storeLoggedInUser(user))
    );
  }

  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.storeCookie(user.token);
    this.userEvents.next(user);
  }

  /**
   * Visible for testing.
   * This is called at startup, to retrieve the user from the local storage rememberMe item.
   * If found, it emits an event from userEvents. The local storage is the single point of truth, but we also need
   * a cookie for some operations (like loading a file, without using an AJAX request). So, if there is a user in the
   * local storage, then it's also stored in a session cookie. Otherwise, the session cookie is deleted.
   */
  _retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user: UserModel = JSON.parse(value);
      this.storeCookie(user.token);
      this.userEvents.next(user);
    } else {
      this.deleteCookie();
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
    this.deleteCookie();
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

  private storeCookie(token: string) {
    document.cookie = `globe42_token=${token};path=/`;
  }

  private deleteCookie() {
    document.cookie = `globe42_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
