import { Injectable } from '@angular/core';
import { PersonIdentityModel } from './models/person.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ParticipationService } from './participation.service';
import { Observable } from 'rxjs';
import { ActivityType } from './models/activity-type.model';

@Injectable({ providedIn: 'root' })
export class ParticipantsResolverService implements Resolve<Array<PersonIdentityModel>> {
  constructor(private participationService: ParticipationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Array<PersonIdentityModel>> {
    return this.participationService.listParticipants(
      route.paramMap.get('activityType') as ActivityType
    );
  }
}
