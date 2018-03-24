import { Injectable } from '@angular/core';
import { ParticipationService } from './participation.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ParticipationModel } from './models/participation.model';
import { Observable } from 'rxjs';
import { PersonModel } from './models/person.model';

@Injectable({ providedIn: 'root' })
export class ParticipationsResolverService implements Resolve<Array<ParticipationModel>> {

  constructor(private participationService: ParticipationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ParticipationModel>> {
    const person: PersonModel = route.parent.data['person'];
    return this.participationService.list(person.id);
  }
}
