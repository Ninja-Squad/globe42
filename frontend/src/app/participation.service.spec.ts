import { TestBed, inject } from '@angular/core/testing';

import { ParticipationService } from './participation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ParticipationModel } from './models/participation.model';
import { PersonIdentityModel } from './models/person.model';

describe('ParticipationService', () => {
  let service: ParticipationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ParticipationService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(ParticipationService);
    http = TestBed.get(HttpTestingController);
  });

  it('should list participations of a person', () => {
    const expectedParticipations = [{ id: 42 }] as Array<ParticipationModel>;

    let actualParticipations;
    service.list(1).subscribe(participations => actualParticipations = participations);

    http.expectOne({url: '/api/persons/1/participations', method: 'GET'}).flush(expectedParticipations);
    expect(actualParticipations).toEqual(expectedParticipations);
  });

  it('should create participation', () => {
    let actualParticipation: ParticipationModel = null;
    service.create(1, 'MEAL').subscribe(participation => actualParticipation = participation);

    const testRequest = http.expectOne({url: '/api/persons/1/participations', method: 'POST'});
    expect(testRequest.request.body).toEqual({ activityType: 'MEAL' });
    const expectedParticipation: ParticipationModel = { id: 42, activityType: 'MEAL' };
    testRequest.flush(expectedParticipation);

    expect(actualParticipation).toEqual(expectedParticipation);
  });

  it('should delete participation', () => {
    let ok = false;
    service.delete(1, 42).subscribe(() => ok = true);

    http.expectOne({url: '/api/persons/1/participations/42', method: 'DELETE'}).flush(204);

    expect(ok).toBe(true);
  });

  it('should list participants of an activity type', () => {
    const expectedParticipants = [{ id: 42 }] as Array<PersonIdentityModel>;

    let actualParticipants;
    service.listParticipants('MEAL').subscribe(participants => actualParticipants = participants);

    http.expectOne({url: '/api/activity-types/MEAL/participants', method: 'GET'}).flush(expectedParticipants);
    expect(actualParticipants).toEqual(expectedParticipants);
  });
});
