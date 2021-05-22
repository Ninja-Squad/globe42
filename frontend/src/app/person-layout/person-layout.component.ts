import { Component, OnInit } from '@angular/core';
import { PersonModel, ReminderModel } from '../models/person.model';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CurrentPersonService } from '../current-person.service';
import { CurrentPersonReminderService } from '../current-person-reminder.service';
import { ViewportScroller } from '@angular/common';

type MembershipStatus = 'OK' | 'KO' | 'OUT_OF_DATE' | 'loading';

@Component({
  selector: 'gl-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss'],
  providers: [CurrentPersonReminderService]
})
export class PersonLayoutComponent implements OnInit {
  person$: Observable<PersonModel>;
  reminders$: Observable<Array<ReminderModel>>;
  membershipStatus$: Observable<MembershipStatus>;

  constructor(
    private currentPersonService: CurrentPersonService,
    private currentPersonReminderService: CurrentPersonReminderService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.person$ = this.currentPersonService.personChanges$.pipe(
      tap(person => {
        this.reminders$ = this.currentPersonReminderService.initialize(person.id);
        this.membershipStatus$ = this.reminders$.pipe(
          map(reminders => {
            if (reminders.some(reminder => reminder.type === 'MEMBERSHIP_PAYMENT_OUT_OF_DATE')) {
              return 'OUT_OF_DATE';
            } else if (reminders.some(reminder => reminder.type === 'MEMBERSHIP_TO_RENEW')) {
              return 'KO';
            } else {
              return 'OK';
            }
          }),
          startWith('loading' as MembershipStatus)
        );
      })
    );
  }
}
