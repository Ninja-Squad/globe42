import { Injectable } from '@angular/core';
import { PersonIdentityModel } from './models/person.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ParticipationService } from './participation.service';
import { Observable } from 'rxjs/Observable';
import { ActivityType } from './models/participation.model';

@Injectable()
export class ParticipantsResolverService implements Resolve<Array<PersonIdentityModel>> {

  constructor(private participationService: ParticipationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<PersonIdentityModel>> {
    return this.participationService.listParticipants(route.paramMap.get('activityType') as ActivityType);
  }
}
