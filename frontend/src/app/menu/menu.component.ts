import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserModel } from '../models/user.model';
import { CurrentUserService } from '../current-user/current-user.service';

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

}
