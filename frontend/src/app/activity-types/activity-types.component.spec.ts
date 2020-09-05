import { TestBed } from '@angular/core/testing';

import { ActivityTypesComponent } from './activity-types.component';
import { ACTIVITY_TYPE_TRANSLATIONS, DisplayActivityTypePipe } from '../display-activity-type.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ComponentTester } from 'ngx-speculoos';

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
      declarations: [ActivityTypesComponent, DisplayActivityTypePipe],
      imports: [RouterTestingModule]
    });

    tester = new ActivityTypesComponentTester();
    tester.detectChanges();
  });

  it('should expose all activity types', () => {
    expect(tester.componentInstance.activityTypes.length).toBe(ACTIVITY_TYPE_TRANSLATIONS.length);
    expect(tester.componentInstance.activityTypes[0]).toBe(ACTIVITY_TYPE_TRANSLATIONS[0].key);
  });

  it('should display links to activity type details', () => {
    expect(tester.activityTypeLinks.length).toBe(ACTIVITY_TYPE_TRANSLATIONS.length);
    expect(tester.activityTypeLinks[0]).toHaveText(ACTIVITY_TYPE_TRANSLATIONS[0].translation);
  });

  it('should have a router outlet', () => {
    expect(tester.debugElement.query(By.directive(RouterOutlet))).toBeTruthy();
  });
});
