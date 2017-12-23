import { TestBed } from '@angular/core/testing';

import { ParticipantsResolverService } from './participants-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { ParticipationService } from './participation.service';
import { Observable } from 'rxjs/Observable';
import { PersonIdentityModel } from './models/person.model';
import { convertToParamMap } from '@angular/router';

describe('ParticipantsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParticipantsResolverService, ParticipationService],
      imports: [HttpClientModule]
    });
  });

  it('should resolve the list of participants of an activity type', () => {
    const participationService = TestBed.get(ParticipationService);
    const participants = Observable.of([{ id: 1 }] as Array<PersonIdentityModel>);

    spyOn(participationService, 'listParticipants').and.returnValue(participants);

    const resolver: ParticipantsResolverService = TestBed.get(ParticipantsResolverService);
    const route: any = { paramMap: convertToParamMap({ activityType: 'MEAL' }) };
    const result = resolver.resolve(route, null);
    expect(result).toBe(participants);
    expect(participationService.listParticipants).toHaveBeenCalledWith('MEAL');
  });
});
