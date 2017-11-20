import { TestBed } from '@angular/core/testing';

import { ParticipationService } from './participation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ParticipationModel } from './models/participation.model';
import { PersonIdentityModel } from './models/person.model';
import { HttpTester } from './http-tester.spec';

describe('ParticipationService', () => {
  let service: ParticipationService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ParticipationService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(ParticipationService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
  });

  it('should list participations of a person', () => {
    const expectedParticipations = [{ id: 42 }] as Array<ParticipationModel>;
    httpTester.testGet('/api/persons/1/participations', expectedParticipations, service.list(1));
  });

  it('should create participation', () => {
    const expectedParticipation: ParticipationModel = { id: 42, activityType: 'MEAL' };
    httpTester.testPost(
      '/api/persons/1/participations',
      { activityType: 'MEAL' },
      expectedParticipation,
      service.create(1, 'MEAL'));
  });

  it('should delete participation', () => {
    httpTester.testDelete('/api/persons/1/participations/42', service.delete(1, 42));
  });

  it('should list participants of an activity type', () => {
    const expectedParticipants = [{ id: 42 }] as Array<PersonIdentityModel>;
    httpTester.testGet(
      '/api/activity-types/MEAL/participants',
      expectedParticipants,
      service.listParticipants('MEAL'));
  });
});
