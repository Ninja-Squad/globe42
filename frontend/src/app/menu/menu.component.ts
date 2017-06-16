import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'gl-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  navbarCollapsed = true;
  user: UserModel | null;
  userEventsSubscription: Subscription;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.userEventsSubscription = this.userService.userEvents
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

  logout(event) {
    event.preventDefault();
    this.userService.logout();
    this.router.navigate(['/']);
  }

}
