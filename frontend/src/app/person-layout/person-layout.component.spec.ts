import { async, TestBed } from '@angular/core/testing';

import { PersonLayoutComponent } from './person-layout.component';
import { PersonModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FullnamePipe } from '../fullname.pipe';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MembershipModel } from '../models/membership.model';
import { MembershipService } from '../membership.service';

describe('PersonLayoutComponent', () => {
  const person = {
    id: 42,
    firstName: 'John',
    lastName: 'Doe',
    nickName: 'john',
    mediationEnabled: true
  } as PersonModel;

  const activatedRoute = {
    data: of({ person }),
    snapshot: {}
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
    declarations: [PersonLayoutComponent, FullnamePipe],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute }
    ]
  })));

  it('should display the person full name as title', () => {
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const name = nativeElement.querySelector('h1#fullName');
    expect(name.textContent).toContain('John Doe (john)');
  });

  it('should have 8 nav links and a router outlet', () => {
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const links = nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(8);

    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });

  it('should only have 5 nav links if mediation is not enabled', () => {
    person.mediationEnabled = false;
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const links = nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(5);
  });

  it('should have a loading membership status initially', () => {
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.membershipStatus).toBe('loading');
    expect(fixture.nativeElement.querySelector('#membership-warning-icon')).toBeFalsy();
  });

  it('should change the working status when the current membership is loaded or when it is created or deleted', () => {
    const membershipService: MembershipService = TestBed.get(MembershipService);
    spyOn(membershipService, 'getCurrent').and.returnValue(of({} as MembershipModel));

    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.membershipStatus).toBe('OK');
    expect(membershipService.getCurrent).toHaveBeenCalledWith(person.id);
    expect(fixture.nativeElement.querySelector('#membership-warning-icon')).toBeFalsy();

    membershipService.currentMembership$.next(null);
    fixture.detectChanges();
    expect(fixture.componentInstance.membershipStatus).toBe('KO');
    expect(fixture.nativeElement.querySelector('#membership-warning-icon')).toBeTruthy();

    membershipService.currentMembership$.next({} as MembershipModel);
    fixture.detectChanges();
    expect(fixture.componentInstance.membershipStatus).toBe('OK');
    expect(fixture.nativeElement.querySelector('#membership-warning-icon')).toBeFalsy();

    fixture.componentInstance.ngOnDestroy();
    membershipService.currentMembership$.next(null);
    fixture.detectChanges();
    expect(fixture.componentInstance.membershipStatus).toBe('OK'); // should have been unsubscribed
  });
});
