import { TestBed } from '@angular/core/testing';

import { PersonLayoutComponent } from './person-layout.component';
import { PersonModel, ReminderModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FullnamePipe } from '../fullname.pipe';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { ComponentTester } from 'ngx-speculoos';
import { LOCALE_ID } from '@angular/core';
import { CurrentPersonService } from '../current-person.service';
import { CurrentPersonReminderService } from '../current-person-reminder.service';
import { PersonRemindersComponent } from '../person-reminders/person-reminders.component';

class PersonLayoutComponentTester extends ComponentTester<PersonLayoutComponent> {
  constructor() {
    super(PersonLayoutComponent);
  }

  get title() {
    return this.element('h1#fullName');
  }

  get navLinks() {
    return this.elements('a.nav-link');
  }

  get membershipWarningIcon() {
    return this.element('#membership-warning-icon');
  }

  get deathMessage() {
    return this.element('#death-message');
  }

  get reminders() {
    return this.element('.reminders');
  }
}

describe('PersonLayoutComponent', () => {
  let person: PersonModel;
  let tester: PersonLayoutComponentTester;
  let remindersSubject: Subject<Array<ReminderModel>>;

  beforeEach(() => {
    person = {
      id: 42,
      firstName: 'John',
      lastName: 'Doe',
      nickName: 'john',
      mediationEnabled: true
    } as PersonModel;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, GlobeNgbTestingModule],
      declarations: [PersonLayoutComponent, FullnamePipe, PersonRemindersComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });

    const currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'personChanges$').and.returnValue(of(person));

    tester = new PersonLayoutComponentTester();
    const currentPersonReminderService = tester.debugElement.injector.get(
      CurrentPersonReminderService
    );
    remindersSubject = new Subject<Array<ReminderModel>>();
    spyOn(currentPersonReminderService, 'initialize').and.returnValue(remindersSubject);
  });

  it('should display the person full name as title', () => {
    tester.detectChanges();

    expect(tester.title).toContainText('John Doe (john)');
  });

  it('should have 10 nav links and a router outlet', () => {
    tester.detectChanges();

    expect(tester.navLinks.length).toBe(10);

    const outlet = tester.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });

  it('should only have 6 nav links if mediation is not enabled', () => {
    person.mediationEnabled = false;
    tester.detectChanges();

    expect(tester.navLinks.length).toBe(6);
  });

  it('should have a loading membership status initially and no reminders', () => {
    tester.detectChanges();

    expect(tester.membershipWarningIcon).toBeNull();
    expect(tester.reminders).toBeNull();
  });

  it('should change the membership status and the reminders alert when the reminders change', () => {
    tester.detectChanges();

    remindersSubject.next([{ type: 'MEMBERSHIP_TO_RENEW' }]);
    tester.detectChanges();
    expect(tester.membershipWarningIcon).not.toBeNull();
    expect(tester.reminders).not.toBeNull();

    remindersSubject.next([]);
    tester.detectChanges();
    expect(tester.membershipWarningIcon).toBeNull();
    expect(tester.reminders).toBeNull();

    remindersSubject.next([{ type: 'MEMBERSHIP_PAYMENT_OUT_OF_DATE' }]);
    tester.detectChanges();
    expect(tester.membershipWarningIcon).not.toBeNull();
    expect(tester.reminders).not.toBeNull();
  });

  it('should not display a death message if not dead', () => {
    tester.detectChanges();
    expect(tester.deathMessage).toBeNull();
  });

  it('should display a death message if dead', () => {
    person.deathDate = '2019-07-26';
    tester.detectChanges();
    expect(tester.deathMessage).toContainText('John Doe (john) est décédé(e) le 26 juillet 2019');
  });

  it('should not display death navlink and activities navlink if dead', () => {
    person.deathDate = '2019-07-26';
    tester.detectChanges();
    expect(tester.navLinks.length).toBe(8);
    expect(tester.testElement).not.toContainText('Décès');
    expect(tester.testElement).not.toContainText('Activités');
  });
});
