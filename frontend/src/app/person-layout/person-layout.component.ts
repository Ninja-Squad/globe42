import { Component, OnDestroy, OnInit } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { switchMap, tap } from 'rxjs/operators';
import { MembershipService } from '../membership.service';
import { merge, Subscription } from 'rxjs';
import { CurrentPersonService } from '../current-person.service';

@Component({
  selector: 'gl-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss']
})
export class PersonLayoutComponent implements OnInit, OnDestroy {

  person: PersonModel;
  membershipStatus: 'OK' | 'KO' | 'OUT_OF_DATE' | 'loading' = 'loading';
  private membershipSubscription: Subscription;

  constructor(private currentPersonService: CurrentPersonService,
              private membershipService: MembershipService) {}

  ngOnInit() {
    this.currentPersonService.personChanges$.subscribe(person => this.person = person);

    this.membershipSubscription = merge(
      this.currentPersonService.personChanges$.pipe(
        tap(() => this.membershipStatus = 'loading'),
        switchMap(person => this.membershipService.getCurrent(person.id))
      ),
      this.membershipService.currentMembership$
    ).subscribe(membership => {
      if (membership) {
        this.membershipStatus = membership.paymentMode === 'OUT_OF_DATE' ? 'OUT_OF_DATE' : 'OK';
      } else {
        this.membershipStatus = 'KO';
      }
    });
  }

  ngOnDestroy(): void {
    this.membershipSubscription.unsubscribe();
  }
}
