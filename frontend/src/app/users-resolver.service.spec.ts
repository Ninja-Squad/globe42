import { TestBed } from '@angular/core/testing';

import { UsersResolverService } from './users-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { UserService } from './user.service';

describe('UsersResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UsersResolverService, UserService],
    imports: [HttpClientModule]
  }));

  it('should retrieve users', () => {
    const userService = TestBed.get(UserService);
    const expectedResult = Observable.of([
      { id: 42, login: 'ced', admin: true }
    ]);
    spyOn(userService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.get(UsersResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResult);
  });
});
