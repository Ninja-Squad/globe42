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
import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { CurrentPersonService } from '../current-person.service';

class PersonMembershipsComponentTester extends ComponentTester<PersonMembershipsComponent> {
  constructor() {
    super(PersonMembershipsComponent);
  }

  get title() {
    return this.element('h2');
  }

  get noCurrentMembership() {
    return this.element('#no-current-membership');
  }

  get currentMembership() {
    return this.element('#current-membership');
  }

  get oldMemberships() {
    return this.element('#old-memberships');
  }

  get alert() {
    return this.element('ngb-alert');
  }

  get paymentMode() {
    return this.select('#paymentMode');
  }

  get paymentDate() {
    return this.input('#paymentDate');
  }

  get cardNumber() {
    return this.input('#cardNumber');
  }

  get save() {
    return this.button('#save');
  }

  get delete() {
    return this.button('#delete-button');
  }
}

describe('PersonMembershipsComponent', () => {
  let person: PersonModel;
  let memberships: Array<MembershipModel>;
  let tester: PersonMembershipsComponentTester;

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
        HttpClientTestingModule,
        GlobeNgbModule.forRoot(),
        ReactiveFormsModule,
        ValdemortModule
      ]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue(person);

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

    tester = new PersonMembershipsComponentTester();
  }));

  afterEach(() => jasmine.clock().uninstall());

  it('should only display missing current membership when no membership', () => {
    tester.detectChanges();
    const component = tester.componentInstance;

    expect(component.person).toBe(person);
    expect(component.currentYear).toBe(2018);
    expect(component.currentMembership).toBeNull();
    expect(component.oldMemberships).toEqual([]);
    expect(component.membershipForm.value).toEqual({
      paymentMode: null,
      paymentDate: '2018-04-30',
      cardNumber: null
    });

    expect(tester.title).toHaveText(`Adhésion de l'année en cours (2018)`);
    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
    expect(tester.oldMemberships).toBeNull();

    expect(tester.alert).toContainText(`Pas d'adhésion pour l'année en cours.`);
  });

  it('should validate and create new membership', () => {
    tester.detectChanges();

    expect(tester.paymentMode).toHaveSelectedLabel('');
    expect(tester.paymentMode.optionLabels.length).toBe(PAYMENT_MODE_TRANSLATIONS.length);
    expect(tester.paymentMode.optionLabels[0]).toBe('');
    expect(tester.paymentMode.optionLabels[1]).toBe('Chèque');
    expect(tester.paymentMode.optionLabels[2]).toBe('Espèces');
    expect(tester.paymentDate).toHaveValue('30/04/2018');
    expect(tester.cardNumber).toHaveValue('');

    tester.paymentMode.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('Le mode de paiement est obligatoire');

    tester.paymentDate.fillWith('');
    tester.paymentDate.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('La date de paiement est obligatoire');

    tester.paymentDate.fillWith('01/05/2018');
    expect(tester.testElement).toContainText('La date de paiement doit être dans le passé');

    tester.paymentDate.fillWith('31/12/2017');
    expect(tester.testElement).toContainText(`La date de paiement doit être dans l'année en cours`);

    tester.cardNumber.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('Le n° de carte est obligatoire');

    tester.paymentMode.selectIndex(1);
    tester.paymentDate.fillWith('30/04/2018');
    tester.cardNumber.fillWith('002');

    const membershipService: MembershipService = TestBed.inject(MembershipService);
    const newMembership: MembershipModel = {
      id: 56,
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2018-04-30',
      cardNumber: '002'
    };
    spyOn(membershipService, 'createCurrent').and.returnValue(of(newMembership));

    tester.save.click();

    expect(membershipService.createCurrent).toHaveBeenCalledWith(person.id, {
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2018-04-30',
      cardNumber: '002'
    });
    expect(tester.componentInstance.currentMembership).toEqual(newMembership);
    expect(tester.noCurrentMembership).toBeNull();
    expect(tester.currentMembership).not.toBeNull();
  });

  it('should only display missing current membership and old memberships when no current membership', () => {
    memberships.push({
      id: 42,
      year: 2017,
      paymentMode: 'CHECK',
      paymentDate: '2017-01-31',
      cardNumber: '002'
    });

    const component = tester.componentInstance;

    tester.detectChanges();

    expect(component.currentMembership).toBeNull();
    expect(component.oldMemberships).toEqual(memberships);

    expect(component.membershipForm.value).toEqual({
      paymentMode: null,
      paymentDate: '2018-04-30',
      cardNumber: null
    });

    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
    expect(tester.oldMemberships).not.toBeNull();

    expect(tester.alert).toContainText(`Pas d'adhésion pour l'année en cours.`);
    expect(tester.oldMemberships).toContainText('2017');
    expect(tester.oldMemberships).toContainText('31 janv. 2017');
    expect(tester.oldMemberships).toContainText('Chèque');
    expect(tester.oldMemberships).toContainText('002');
  });

  it('should display current membership when current membership exists', () => {
    memberships.push({
      id: 42,
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2018-01-31',
      cardNumber: '002'
    });

    const component = tester.componentInstance;

    tester.detectChanges();

    expect(component.currentMembership).toEqual(memberships[0]);
    expect(component.oldMemberships).toEqual([]);

    expect(tester.noCurrentMembership).toBeNull();
    expect(tester.currentMembership).not.toBeNull();
    expect(tester.oldMemberships).toBeNull();

    expect(tester.alert).toContainText(`Payée (Chèque) le 31 janv. 2018.`);
    expect(tester.alert).toContainText(`Carte n° 002`);
  });

  it('should delete current membership if confirmed', () => {
    memberships.push({
      id: 42,
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2018-01-31',
      cardNumber: '002'
    });

    tester.detectChanges();

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const membershipService: MembershipService = TestBed.inject(MembershipService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(membershipService, 'deleteCurrent').and.returnValue(of(undefined));

    tester.delete.click();

    expect(membershipService.deleteCurrent).toHaveBeenCalledWith(person.id, 42);
    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
    expect(tester.oldMemberships).toBeNull();
  });
});
