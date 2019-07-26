import { Injectable } from '@angular/core';
import { MembershipService } from './membership.service';
import { MembershipModel } from './models/membership.model';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentPersonService } from './current-person.service';

@Injectable({ providedIn: 'root' })
export class MembershipsResolverService implements Resolve<Array<MembershipModel>> {

  constructor(private currentPersonService: CurrentPersonService,
              private membershipService: MembershipService) { }

  resolve(): Observable<Array<MembershipModel>> {
    return this.membershipService.list(this.currentPersonService.snapshot.id);
  }
}
