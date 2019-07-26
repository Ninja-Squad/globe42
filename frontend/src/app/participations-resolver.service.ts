import { Injectable } from '@angular/core';
import { ParticipationService } from './participation.service';
import { Resolve } from '@angular/router';
import { ParticipationModel } from './models/participation.model';
import { Observable } from 'rxjs';
import { CurrentPersonService } from './current-person.service';

@Injectable({ providedIn: 'root' })
export class ParticipationsResolverService implements Resolve<Array<ParticipationModel>> {

  constructor(private currentPersonService: CurrentPersonService,
              private participationService: ParticipationService) { }

  resolve(): Observable<Array<ParticipationModel>> {
    return this.participationService.list(this.currentPersonService.snapshot.id);
  }
}
