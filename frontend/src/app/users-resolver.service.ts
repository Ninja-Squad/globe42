import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserModel } from './models/user.model';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UsersResolverService implements Resolve<Array<UserModel>> {

  constructor(private userService: UserService) { }

  resolve(): Observable<Array<UserModel>> {
    return this.userService.list();
  }
}
