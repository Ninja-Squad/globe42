import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserModel } from './models/user.model';

const users: Array<UserModel> = [
  {
    id: 0, firstName: 'John', lastName: 'Doe', surName: 'john', birthDate: '1980-01-01',
    mediationCode: 'code1', address: 'Chemin de la gare', zipCode: 42000,
    city: 'Saint Etienne', email: 'john@mail.com', isAdherent: true, entryDate: '2016-12-01'
  },
  {
    id: 1, firstName: 'Jane', lastName: 'Doe', surName: 'jane', birthDate: '1979-01-01',
    mediationCode: 'code2', address: 'Chemin de la gare', zipCode: 42000,
    city: 'Saint Etienne', email: 'jane@mail.com', isAdherent: false, entryDate: '2016-12-01'
  }
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
