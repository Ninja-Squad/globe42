import { TestBed } from '@angular/core/testing';

import { ActivityService } from './activity.service';
import { HttpTester } from './http-tester.spec';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Page } from './models/page';
import { Activity, ActivityCommand, ActivityModel } from './models/activity.model';
import { activityType } from './models/activity-type.model';

describe('ActivityService', () => {
  let http: HttpTestingController;
  let httpTester: HttpTester;
  let service: ActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    http = TestBed.inject(HttpTestingController);
    httpTester = new HttpTester(http);
    service = TestBed.inject(ActivityService);
  });

  it('should list activities', () => {
    const backendActivities: Page<ActivityModel> = {
      totalPages: 2,
      number: 1,
      size: 20,
      totalElements: 21,
      content: [
        {
          id: 21,
          date: '2021-01-01',
          type: 'MEAL',
          participants: [
            {
              id: 42
            }
          ]
        }
      ]
    } as Page<ActivityModel>;

    let actualActivities: Page<Activity>;
    service.list(1).subscribe(p => (actualActivities = p));

    http.expectOne({ method: 'GET', url: '/api/activities?page=1' }).flush(backendActivities);

    expect(actualActivities).toEqual({
      totalPages: 2,
      number: 1,
      size: 20,
      totalElements: 21,
      content: [
        {
          id: 21,
          date: '2021-01-01',
          type: activityType('MEAL'),
          participants: [
            {
              id: 42
            }
          ]
        }
      ]
    } as Page<Activity>);
  });

  it('should delete an activity', () => {
    httpTester.testDelete('/api/activities/42', service.delete(42));
  });

  it('should create an activity', () => {
    const command = { type: 'MEAL' } as ActivityCommand;
    const backendActivity = {
      id: 21,
      date: '2021-01-01',
      type: 'MEAL',
      participants: [
        {
          id: 42
        }
      ]
    } as ActivityModel;

    let actualActivity: Activity;
    service.create(command).subscribe(a => (actualActivity = a));

    const testRequest = http.expectOne({ method: 'POST', url: '/api/activities' });
    expect(testRequest.request.body).toBe(command);
    testRequest.flush(backendActivity);
    expect(actualActivity).toEqual({
      id: 21,
      date: '2021-01-01',
      type: activityType('MEAL'),
      participants: [
        {
          id: 42
        }
      ]
    } as Activity);
  });

  it('should update an activity', () => {
    const command = { type: 'MEAL' } as ActivityCommand;
    httpTester.testPut('/api/activities/42', command, service.update(42, command));
  });
});
