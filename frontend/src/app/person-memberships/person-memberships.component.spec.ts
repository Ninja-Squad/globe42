import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { async, TestBed } from '@angular/core/testing';
import { MembershipModel } from '../models/membership.model';
import { MembershipService } from '../membership.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonMembershipsComponent } from './person-memberships.component';
import { DateTime } from 'luxon';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { DisplayPaymentModePipe, PAYMENT_MODE_TRANSLATIONS } from '../display-payment-mode.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmService } from '../confirm.service';
import { LOCALE_ID } from '@angular/core';
import { of } from 'rxjs';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';
import { fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { CurrentPersonService } from '../current-person.service';

describe('PersonMembershipsComponent', () => {
  let person: PersonModel;
  let memberships: Array<MembershipModel>;

  beforeEach(async(() => {
    jasmine.clock().mockDate(DateTime.fromISO('2018-04-30T15:30:00').toJSDate());

    person = {
      id: 1
    } as PersonModel;

    memberships = [];

    const route = fakeRoute({
      snapshot: fakeSnapshot({
        data: {
          memberships
        }
      })
    });

    TestBed.configureTestingModule({
      declarations: [
        PersonMembershipsComponent,
        DisplayPaymentModePipe,
        ValidationDefaultsComponent,
        PageTitleDirective,
        FullnamePipe
      ],
      providers: [
        { provide: ActivatedRoute, useFactory: () => route },
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ],
      imports: [
        HttpClientTestingModule, GlobeNgbModule.forRoot(), ReactiveFormsModule, ValdemortModule
      ]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue(person);

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
  }));

  afterEach(() => jasmine.clock().uninstall());

  it('should only display missing current membership when no membership', () => {
    const fixture = TestBed.createComponent(PersonMembershipsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.person).toBe(person);
    expect(component.currentYear).toBe(2018);
    expect(component.currentMembership).toBeNull();
    expect(component.oldMemberships).toEqual([]);
    expect(component.membershipForm.value).toEqual({
      paymentMode: null,
      paymentDate: '2018-04-30',
      cardNumber: null
    });

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h2').textContent).toBe(`Adhésion de l'année en cours (2018)`);
    expect(element.querySelector('#no-current-membership')).toBeTruthy();
    expect(element.querySelector('#current-membership')).toBeFalsy();
    expect(element.querySelector('#old-memberships')).toBeFalsy();

    expect(element.querySelector('ngb-alert').textContent).toContain(`Pas d'adhésion pour l'année en cours.`);
  });

  it('should validate and create new membership', () => {
    const fixture = TestBed.createComponent(PersonMembershipsComponent);

    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    const paymentMode: HTMLSelectElement = element.querySelector('#paymentMode');
    const paymentDate: HTMLInputElement = element.querySelector('#paymentDate');
    const cardNumber: HTMLInputElement = element.querySelector('#cardNumber');

    expect(paymentMode.selectedIndex).toBe(0);
    expect(paymentMode.options.length).toBe(PAYMENT_MODE_TRANSLATIONS.length);
    expect(paymentMode.options[0].textContent).toBe('');
    expect(paymentMode.options[1].textContent).toBe('Chèque');
    expect(paymentMode.options[2].textContent).toBe('Espèces');
    expect(paymentDate.value).toBe('30/04/2018');
    expect(cardNumber.value).toBe('');

    paymentMode.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(element.textContent).toContain('Le mode de paiement est obligatoire');

    paymentDate.value = '';
    paymentDate.dispatchEvent(new Event('input'));
    paymentDate.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(element.textContent).toContain('La date de paiement est obligatoire');

    paymentDate.value = '01/05/2018';
    paymentDate.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.textContent).toContain('La date de paiement doit être dans le passé');

    paymentDate.value = '31/12/2017';
    paymentDate.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.textContent).toContain(`La date de paiement doit être dans l'année en cours`);

    cardNumber.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(element.textContent).toContain('Le n° de carte est obligatoire');

    paymentMode.selectedIndex = 1;
    paymentMode.dispatchEvent(new Event('change'));
    paymentDate.value = '30/04/2018';
    paymentDate.dispatchEvent(new Event('input'));
    cardNumber.value = '002';
    cardNumber.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const membershipService: MembershipService = TestBed.inject(MembershipService);
    const newMembership: MembershipModel = {
      id: 56,
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2018-04-30',
      cardNumber: '002'
    };
    spyOn(membershipService, 'createCurrent').and.returnValue(of(newMembership));

    const saveButton = element.querySelector('#save') as HTMLButtonElement;
    saveButton.click();
    fixture.detectChanges();

    expect(membershipService.createCurrent).toHaveBeenCalledWith(person.id, {
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2018-04-30',
      cardNumber: '002'
    });
    expect(fixture.componentInstance.currentMembership).toEqual(newMembership);
    expect(element.querySelector('#no-current-membership')).toBeFalsy();
    expect(element.querySelector('#current-membership')).toBeTruthy();
  });

  it('should only display missing current membership and old memberships when no current membership', () => {
    memberships.push(
      {
        id: 42,
        year: 2017,
        paymentMode: 'CHECK',
        paymentDate: '2017-01-31',
        cardNumber: '002'
      }
    );

    const fixture = TestBed.createComponent(PersonMembershipsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.currentMembership).toBeNull();
    expect(component.oldMemberships).toEqual(memberships);

    expect(component.membershipForm.value).toEqual({
      paymentMode: null,
      paymentDate: '2018-04-30',
      cardNumber: null
    });

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('#no-current-membership')).toBeTruthy();
    expect(element.querySelector('#current-membership')).toBeFalsy();
    expect(element.querySelector('#old-memberships')).toBeTruthy();

    expect(element.querySelector('ngb-alert').textContent).toContain(`Pas d'adhésion pour l'année en cours.`);
    const oldMembershipsText = element.querySelector('#old-memberships').textContent;
    expect(oldMembershipsText).toContain('2017');
    expect(oldMembershipsText).toContain('31 janv. 2017');
    expect(oldMembershipsText).toContain('Chèque');
    expect(oldMembershipsText).toContain('002');
  });

  it('should display current membership when current membership exists', () => {
    memberships.push(
      {
        id: 42,
        year: 2018,
        paymentMode: 'CHECK',
        paymentDate: '2018-01-31',
        cardNumber: '002'
      }
    );

    const fixture = TestBed.createComponent(PersonMembershipsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.currentMembership).toEqual(memberships[0]);
    expect(component.oldMemberships).toEqual([]);

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('#no-current-membership')).toBeFalsy();
    expect(element.querySelector('#current-membership')).toBeTruthy();
    expect(element.querySelector('#old-memberships')).toBeFalsy();

    expect(element.querySelector('ngb-alert').textContent).toContain(`Payée (Chèque) le 31 janv. 2018.`);
    expect(element.querySelector('ngb-alert').textContent).toContain(`Carte n° 002`);
  });

  it('should delete current membership if confirmed', () => {
    memberships.push(
      {
        id: 42,
        year: 2018,
        paymentMode: 'CHECK',
        paymentDate: '2018-01-31',
        cardNumber: '002'
      }
    );

    const fixture = TestBed.createComponent(PersonMembershipsComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const membershipService: MembershipService = TestBed.inject(MembershipService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(membershipService, 'deleteCurrent').and.returnValue(of(undefined));

    (element.querySelector('#delete-button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(membershipService.deleteCurrent).toHaveBeenCalledWith(person.id, 42);
    expect(element.querySelector('#no-current-membership')).toBeTruthy();
    expect(element.querySelector('#current-membership')).toBeFalsy();
    expect(element.querySelector('#old-memberships')).toBeFalsy();
  });
});
