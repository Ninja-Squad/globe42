import { TestBed } from '@angular/core/testing';

import { ActivitiesComponent } from './activities.component';
import { ComponentTester, fakeRoute } from 'ngx-speculoos';
import { By } from '@angular/platform-browser';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { activityType } from '../models/activity-type.model';
import { Page } from '../models/page';
import { Activity } from '../models/activity.model';
import { LOCALE_ID } from '@angular/core';
import { FullnamePipe } from '../fullname.pipe';
import { PageTitleDirective } from '../page-title.directive';

class ActivitiesComponentTester extends ComponentTester<ActivitiesComponent> {
  constructor() {
    super(ActivitiesComponent);
  }

  get items() {
    return this.elements('.activity-item');
  }

  get pagination(): NgbPagination | null {
    return this.debugElement.query(By.directive(NgbPagination))?.componentInstance ?? null;
  }
}

describe('ActivitiesComponent', () => {
  let tester: ActivitiesComponentTester;
  let activities: Page<Activity>;

  beforeEach(() => {
    activities = {
      totalPages: 2,
      number: 1,
      size: 20,
      totalElements: 22,
      content: [
        {
          id: 21,
          date: '2021-01-01',
          type: activityType('MEAL'),
          participants: [
            {
              id: 42,
              firstName: 'JB',
              lastName: 'Nizet'
            }
          ]
        },
        {
          id: 22,
          date: '2021-01-02',
          type: activityType('SOCIAL_MEDIATION'),
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
        }
      ]
    } as Page<Activity>;
    const route = fakeRoute({
      data: of({
        activities
      })
    });

    TestBed.configureTestingModule({
      imports: [GlobeNgbTestingModule, RouterTestingModule],
      declarations: [ActivitiesComponent, FullnamePipe, PageTitleDirective],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: LOCALE_ID, useValue: 'fr' }
      ]
    });

    tester = new ActivitiesComponentTester();
    tester.detectChanges();
  });

  it('should display activities', () => {
    expect(tester.items.length).toBe(2);
    expect(tester.items[0]).toContainText('vendredi 1 janvier 2021');
    expect(tester.items[0]).toContainText('Repas');
    expect(tester.items[0]).toContainText('1 présent');
    expect(tester.items[1]).toContainText('2 présents');
  });

  it('should display pagination', () => {
    expect(tester.pagination.page).toBe(2);
    expect(tester.pagination.pageCount).toBe(2);
    expect(tester.pagination.pageSize).toBe(20);
  });

  it('should not display pagination if there is a single page', () => {
    activities.totalPages = 1;
    activities.number = 1;
    tester.detectChanges();

    expect(tester.pagination).toBeNull();
  });
});
