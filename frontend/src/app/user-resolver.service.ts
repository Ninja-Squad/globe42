import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserModel } from './models/user.model';
import { UserService } from './user.service';

@Injectable()
export class UserResolverService {

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserModel> {
    const userId = +route.paramMap.get('id');
    return this.userService.get(userId);
  }

}
