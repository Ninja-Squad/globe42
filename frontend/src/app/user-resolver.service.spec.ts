import { TestBed } from '@angular/core/testing';

import { UserResolverService } from './user-resolver.service';
import { UserModel } from './models/user.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('UserResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
  });

  it('should resolve the user', () => {
    const userService = TestBed.inject(UserService);
    const expectedResult = of({id: 42} as UserModel);
    spyOn(userService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.inject(UserResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(userService.get).toHaveBeenCalledWith(42);
  });
});
