import { TestBed } from '@angular/core/testing';

import { PersonLayoutComponent } from './person-layout.component';
import { PersonModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FullnamePipe } from '../fullname.pipe';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MembershipModel } from '../models/membership.model';
import { MembershipService } from '../membership.service';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { ComponentTester } from 'ngx-speculoos';
import { LOCALE_ID } from '@angular/core';
import { CurrentPersonService } from '../current-person.service';

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
}

describe('PersonLayoutComponent', () => {
  let person: PersonModel;
  let tester: PersonLayoutComponentTester;

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
      declarations: [PersonLayoutComponent, FullnamePipe],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });

    const currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'personChanges$').and.returnValue(of(person));

    tester = new PersonLayoutComponentTester();
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

  it('should have a loading membership status initially', () => {
    tester.detectChanges();

    expect(tester.componentInstance.membershipStatus).toBe('loading');
    expect(tester.membershipWarningIcon).toBeFalsy();
  });

  it('should change the working status when the current membership is loaded or when it is created or deleted', () => {
    const membershipService: MembershipService = TestBed.inject(MembershipService);
    spyOn(membershipService, 'getCurrent').and.returnValue(of({} as MembershipModel));

    tester.detectChanges();

    expect(tester.componentInstance.membershipStatus).toBe('OK');
    expect(membershipService.getCurrent).toHaveBeenCalledWith(person.id);
    expect(tester.membershipWarningIcon).toBeFalsy();

    membershipService.currentMembership$.next(null);
    tester.detectChanges();
    expect(tester.componentInstance.membershipStatus).toBe('KO');
    expect(tester.membershipWarningIcon).toBeTruthy();

    membershipService.currentMembership$.next({ paymentMode: 'CASH' } as MembershipModel);
    tester.detectChanges();
    expect(tester.componentInstance.membershipStatus).toBe('OK');
    expect(tester.membershipWarningIcon).toBeFalsy();

    membershipService.currentMembership$.next({ paymentMode: 'OUT_OF_DATE' } as MembershipModel);
    tester.detectChanges();
    expect(tester.componentInstance.membershipStatus).toBe('OUT_OF_DATE');
    expect(tester.membershipWarningIcon).toBeTruthy();

    tester.componentInstance.ngOnDestroy();
    membershipService.currentMembership$.next(null);
    tester.detectChanges();
    expect(tester.componentInstance.membershipStatus).toBe('OUT_OF_DATE'); // should have been unsubscribed
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
