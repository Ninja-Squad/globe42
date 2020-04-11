import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserModel } from '../models/user.model';
import { CurrentUserService } from '../current-user/current-user.service';

@Component({
  selector: 'gl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: UserModel;
  userEventsSubscription: Subscription;

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit() {
    this.userEventsSubscription = this.currentUserService.userEvents.subscribe(
      user => (this.user = user)
    );
  }

  ngOnDestroy() {
    if (this.userEventsSubscription) {
      this.userEventsSubscription.unsubscribe();
    }
  }
}
