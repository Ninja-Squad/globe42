import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserModel } from './models/user.model';

@Injectable()
export class UserResolverService implements Resolve<UserModel> {

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<UserModel> {
    return this.userService.get(+route.paramMap.get('id'));
  }

}
