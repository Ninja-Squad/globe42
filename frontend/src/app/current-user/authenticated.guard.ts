import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(private currentUserService: CurrentUserService, private router: Router) {}

  canActivate(): boolean {
    const loggedIn = this.currentUserService.isLoggedIn();
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }
    return loggedIn;
  }
}
