import { TestBed } from '@angular/core/testing';
import { UsersResolverService } from './users-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('UsersResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should retrieve users', () => {
    const userService = TestBed.inject(UserService);
    const expectedResult = of([
      { id: 42, login: 'ced', admin: true }
    ]);
    spyOn(userService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.inject(UsersResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResult);
  });
});
