import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserResolverService } from './user-resolver.service';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';

describe('UserResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UserResolverService, UserService],
    imports: [HttpModule]
  }));

  it('should retrieve a user', () => {
    const userService = TestBed.get(UserService);
    const expectedResult: Observable<UserModel> = Observable.of({ firstName: 'John', lastName: 'Doe' });

    spyOn(userService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.get(UserResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(userService.get).toHaveBeenCalledWith(42);
  });
});
