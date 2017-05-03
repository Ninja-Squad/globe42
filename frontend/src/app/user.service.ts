import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserModel } from './models/user.model';

const users = [
  { id: 0, firstName: 'John', lastName: 'Doe' },
  { id: 1, firstName: 'Jane', lastName: 'Doe' }
];

@Injectable()
export class UserService {


  constructor() { }

  get(id: number): Observable<UserModel> {
    return Observable.of(users[id]);
  }

  update(user: UserModel): Observable<UserModel> {
    users[user.id] = user;
    return Observable.of(user);
  }

  create(user: UserModel): Observable<UserModel> {
    user.id = users.length;
    users[user.id] = user;
    return Observable.of(user);
  }

  list(): Observable<Array<UserModel>> {
    return Observable.of(users);
  }

}
