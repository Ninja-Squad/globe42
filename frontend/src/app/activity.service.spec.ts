import { TestBed } from '@angular/core/testing';

import { ActivityService } from './activity.service';
import { HttpTester } from './http-tester.spec';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Page } from './models/page';
import { Activity, ActivityCommand, ActivityModel, ActivityReport } from './models/activity.model';
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

  it('should get an activity', () => {
    const backendActivity: ActivityModel = {
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
    service.get(21).subscribe(a => (actualActivity = a));

    http.expectOne({ method: 'GET', url: '/api/activities/21' }).flush(backendActivity);

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

  it('should get an activity report', () => {
    const backendReport: ActivityReport = {
      totalActivityCount: 10,
      presences: [
        {
          activityCount: 5,
          person: {
            firstName: 'JB',
            lastName: 'Nizet'
          }
        },
        {
          activityCount: 7,
          person: {
            firstName: 'Claire',
            lastName: 'Brucy'
          }
        }
      ]
    } as ActivityReport;

    let actualReport: ActivityReport;
    service.report('MEAL', '2021-01-01', '2021-01-31').subscribe(r => (actualReport = r));

    http
      .expectOne({
        method: 'GET',
        url: '/api/activities/reports?type=MEAL&from=2021-01-01&to=2021-01-31'
      })
      .flush(backendReport);

    expect(actualReport).toEqual({
      totalActivityCount: 10,
      presences: [
        {
          activityCount: 7,
          person: {
            firstName: 'Claire',
            lastName: 'Brucy'
          }
        },
        {
          activityCount: 5,
          person: {
            firstName: 'JB',
            lastName: 'Nizet'
          }
        }
      ]
    } as ActivityReport);
  });
});
