import { TestBed } from '@angular/core/testing';

import { ActivityTypesComponent } from './activity-types.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ComponentTester } from 'ngx-speculoos';
import { ACTIVITY_TYPES } from '../models/activity-type.model';

class ActivityTypesComponentTester extends ComponentTester<ActivityTypesComponent> {
  constructor() {
    super(ActivityTypesComponent);
  }

  get activityTypeLinks() {
    return this.elements('.nav-item a.nav-link');
  }
}

describe('ActivityTypesComponent', () => {
  let tester: ActivityTypesComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityTypesComponent],
      imports: [RouterTestingModule]
    });

    tester = new ActivityTypesComponentTester();
    tester.detectChanges();
  });

  it('should expose all activity types', () => {
    expect(tester.componentInstance.activityTypes).toBe(ACTIVITY_TYPES);
  });

  it('should display links to activity type details', () => {
    expect(tester.activityTypeLinks.length).toBe(ACTIVITY_TYPES.length);
    expect(tester.activityTypeLinks[0]).toContainText(ACTIVITY_TYPES[0].name);
  });

  it('should have a router outlet', () => {
    expect(tester.debugElement.query(By.directive(RouterOutlet))).toBeTruthy();
  });
});
