import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { MembershipService } from '../membership.service';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'gl-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss']
})
export class PersonLayoutComponent implements OnDestroy {

  person: PersonModel;
  membershipStatus: 'OK' | 'KO' | 'OUT_OF_DATE' | 'loading' = 'loading';
  private membershipSubscription: Subscription;

  constructor(route: ActivatedRoute,
              membershipService: MembershipService) {
    route.data.pipe(
      map(data => data.person as PersonModel)
    ).subscribe(person => this.person = person);

    this.membershipSubscription = merge(
      route.data.pipe(
        tap(() => this.membershipStatus = 'loading'),
        switchMap(data => membershipService.getCurrent(data.person.id))
      ),
      membershipService.currentMembership$
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
