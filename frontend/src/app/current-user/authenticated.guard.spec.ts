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
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), RouterTestingModule, HttpClientTestingModule]
    });

    guard = TestBed.get(AuthenticatedGuard);
    userService = TestBed.get(CurrentUserService);
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
