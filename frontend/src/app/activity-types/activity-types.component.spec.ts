import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTypesComponent } from './activity-types.component';
import { ACTIVITY_TYPE_TRANSLATIONS, DisplayActivityTypePipe } from '../display-activity-type.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';

describe('ActivityTypesComponent', () => {
  let component: ActivityTypesComponent;
  let fixture: ComponentFixture<ActivityTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityTypesComponent, DisplayActivityTypePipe ],
      imports: [ RouterTestingModule ]
    });

    fixture = TestBed.createComponent(ActivityTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should expose all activity types', () => {
    expect(component.activityTypes.length).toBe(ACTIVITY_TYPE_TRANSLATIONS.length);
    expect(component.activityTypes[0]).toBe(ACTIVITY_TYPE_TRANSLATIONS[0].key);
  });

  it('should display links to activity type details', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav-item a.nav-link');
    expect(links.length).toBe(ACTIVITY_TYPE_TRANSLATIONS.length);
    expect(links[0].textContent).toBe(ACTIVITY_TYPE_TRANSLATIONS[0].translation);
  });

  it('should have a router outlet', () => {
    expect(fixture.debugElement.query(By.directive(RouterOutlet))).toBeTruthy();
  });
});
