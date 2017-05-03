import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UsersResolverService } from './users-resolver.service';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';

describe('UsersResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UsersResolverService, UserService]
  }));

  it('should retrieve the users', () => {
    const userService = TestBed.get(UserService);
    const expectedResult: Observable<Array<UserModel>> = Observable.of([{ firstName: 'John', lastName: 'Doe' }]);

    spyOn(userService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.get(UsersResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResult);
  });
});
