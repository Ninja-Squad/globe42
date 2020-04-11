import { AuthenticatedGuard } from './authenticated.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CurrentUserModule } from './current-user.module';
import { CurrentUserService } from './current-user.service';

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard;
  let userService: CurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), RouterTestingModule, HttpClientTestingModule]
    });

    guard = TestBed.inject(AuthenticatedGuard);
    userService = TestBed.inject(CurrentUserService);
  });

  it('should not do anything if logged in', () => {
    spyOn(userService, 'isLoggedIn').and.returnValue(true);

    expect(guard.canActivate()).toBe(true);
  });

  it('should return th UrlTree to login if not logged in', () => {
    spyOn(userService, 'isLoggedIn').and.returnValue(false);

    const router: Router = TestBed.inject(Router);
    expect(guard.canActivate()).toEqual(router.parseUrl('/login'));
  });
});
