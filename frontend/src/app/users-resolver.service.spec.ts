import { TestBed } from '@angular/core/testing';

import { UsersResolverService } from './users-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { JwtInterceptorService } from './jwt-interceptor.service';

describe('UsersResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UsersResolverService, UserService, JwtInterceptorService],
    imports: [HttpClientModule]
  }));

  it('should retrieve users', () => {
    const userService = TestBed.get(UserService);
    let expectedResult = Observable.of([
      { id: 42, login: 'ced', admin: true }
    ]);
    spyOn(userService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.get(UsersResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResult);
  });
});
