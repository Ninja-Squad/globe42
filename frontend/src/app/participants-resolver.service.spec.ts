import { TestBed } from '@angular/core/testing';

import { ParticipantsResolverService } from './participants-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { ParticipationService } from './participation.service';
import { PersonIdentityModel } from './models/person.model';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('ParticipantsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
  });

  it('should resolve the list of participants of an activity type', () => {
    const participationService = TestBed.get(ParticipationService);
    const participants = of([{ id: 1 }] as Array<PersonIdentityModel>);

    spyOn(participationService, 'listParticipants').and.returnValue(participants);

    const resolver: ParticipantsResolverService = TestBed.get(ParticipantsResolverService);
    const route: any = { paramMap: convertToParamMap({ activityType: 'MEAL' }) };
    const result = resolver.resolve(route, null);
    expect(result).toBe(participants);
    expect(participationService.listParticipants).toHaveBeenCalledWith('MEAL');
  });
});
