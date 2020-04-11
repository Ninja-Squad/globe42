import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { CurrentUserService } from './current-user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.currentUserService.isLoggedIn() || this.router.parseUrl('/login');
  }
}
