import { AuthenticatedGuard } from './authenticated.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('AuthenticatedGuard', () => {

  let guard: AuthenticatedGuard;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticatedGuard, UserService, JwtInterceptorService],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });

    guard = TestBed.get(AuthenticatedGuard);
    userService = TestBed.get(UserService);
    router = TestBed.get(Router);

  });

  it('should not do anything if logged in', () => {
    spyOn(userService, 'isLoggedIn').and.returnValue(true);
    spyOn(router, 'navigate');

    expect(guard.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login if not logged in', () => {
    spyOn(userService, 'isLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate');

    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
