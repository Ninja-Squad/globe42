import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserModel } from '../models/user.model';
import { CurrentUserService } from '../current-user/current-user.service';

const MD_BREAKPOINT = 768;

@Component({
  selector: 'gl-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  navbarCollapsed = true;
  user: UserModel | null;
  userEventsSubscription: Subscription;

  constructor(private currentUserService: CurrentUserService, private router: Router) {
  }

  ngOnInit() {
    this.userEventsSubscription = this.currentUserService.userEvents
      .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    if (this.userEventsSubscription) {
      this.userEventsSubscription.unsubscribe();
    }
  }

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(event: Event) {
    event.preventDefault();
    this.currentUserService.logout();
    this.router.navigate(['/']);
  }

  /**
   * In order for the dropdown menus that don't have the standard position to display correctly when the menu is
   * collapsed on smaller devices, the display of the dropdown must be set to static.
   * See https://ng-bootstrap.github.io/#/positioning#dropdown
   * This is a hack, but it does the trick.
   */
  get dropdownDisplay(): 'dynamic' | 'static' {
    return (window.outerWidth < MD_BREAKPOINT) ? 'static' : 'dynamic';
  }
}
