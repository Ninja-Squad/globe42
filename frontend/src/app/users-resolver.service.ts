import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserModel } from './models/user.model';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserService } from './user.service';

@Injectable()
export class UsersResolverService implements Resolve<Array<UserModel>> {

  constructor(private userService: UserService) { }

  resolve(): Observable<Array<UserModel>> {
    return this.userService.list();
  }
}
