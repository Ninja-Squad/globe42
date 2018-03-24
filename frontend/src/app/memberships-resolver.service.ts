import { Injectable } from '@angular/core';
import { MembershipService } from './membership.service';
import { MembershipModel } from './models/membership.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonModel } from './models/person.model';

@Injectable({ providedIn: 'root' })
export class MembershipsResolverService implements Resolve<Array<MembershipModel>> {

  constructor(private membershipService: MembershipService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<MembershipModel>> {
    const person: PersonModel = route.parent.data.person;
    return this.membershipService.list(person.id);
  }
}
