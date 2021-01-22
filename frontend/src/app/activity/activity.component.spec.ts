import { TestBed } from '@angular/core/testing';

import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { activityType } from '../models/activity-type.model';
import { Activity } from '../models/activity.model';
import { LOCALE_ID } from '@angular/core';
import { ConfirmService } from '../confirm.service';
import { ActivityComponent } from './activity.component';
import { ActivityService } from '../activity.service';
import { FullnamePipe } from '../fullname.pipe';
import { PageTitleDirective } from '../page-title.directive';

class ActivityComponentTester extends ComponentTester<ActivityComponent> {
  constructor() {
    super(ActivityComponent);
  }

  get title() {
    return this.element('h1');
  }

  get participants() {
    return this.elements('li');
  }

  get deleteButton() {
    return this.button('#delete-button');
  }
}

describe('ActivityComponent', () => {
  let tester: ActivityComponentTester;
  let activity: Activity;
  let confirmService: jasmine.SpyObj<ConfirmService>;
  let activityService: jasmine.SpyObj<ActivityService>;

  beforeEach(() => {
    activity = {
      id: 22,
      date: '2021-01-02',
      type: activityType('MEAL'),
      participants: [
        {
          id: 42,
          firstName: 'JB',
          lastName: 'Nizet'
        },
        {
          id: 43,
          firstName: 'Claire',
          lastName: 'Brucy'
        }
      ]
    } as Activity;
    const route = fakeRoute({
      snapshot: fakeSnapshot({
        data: {
          activity
        }
      })
    });

    confirmService = jasmine.createSpyObj<ConfirmService>('ConfirmService', ['confirm']);
    activityService = jasmine.createSpyObj<ActivityService>('ActivityService', ['delete']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ActivityComponent, FullnamePipe, PageTitleDirective],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: ConfirmService, useValue: confirmService },
        { provide: ActivityService, useValue: activityService },
        { provide: LOCALE_ID, useValue: 'fr' }
      ]
    });

    tester = new ActivityComponentTester();
    tester.detectChanges();
  });

  it('should display activity', () => {
    expect(tester.title).toContainText('samedi 2 janvier 2021');
    expect(tester.title).toContainText('Repas');
    expect(tester.participants.length).toBe(2);
    expect(tester.participants[0]).toContainText('JB Nizet');
  });

  it('should delete after confirmation', () => {
    confirmService.confirm.and.returnValue(of(undefined));
    activityService.delete.and.returnValue(of(undefined));

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    tester.deleteButton.click();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(activityService.delete).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/activities']);
  });
});
