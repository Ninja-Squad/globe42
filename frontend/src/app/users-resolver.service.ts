import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserModel } from './models/user.model';
import { UserService } from './user.service';

@Injectable()
export class UsersResolverService {

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<UserModel>> {
    return this.userService.list();
  }

}
