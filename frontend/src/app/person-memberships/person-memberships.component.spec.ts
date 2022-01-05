import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { TestBed } from '@angular/core/testing';
import { MembershipModel, PAYMENT_MODES } from '../models/membership.model';
import { MembershipService } from '../membership.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonMembershipsComponent } from './person-memberships.component';
import { DateTime } from 'luxon';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
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
import { CurrentPersonReminderService } from '../current-person-reminder.service';
import { DisplayPaymentModePipe } from '../display-payment-mode.pipe';

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

  get save() {
    return this.button('#save');
  }

  get delete() {
    return this.button('#delete-button');
  }

  get deleteOld() {
    return this.elements<HTMLButtonElement>('.delete-old-button');
  }

  get displayOldMembershipForm() {
    return this.button('#display-old-membership-form-button');
  }

  get oldMembershipForm() {
    return this.element('#old-membership-form');
  }

  get oldYear() {
    return this.select('#oldYear');
  }

  get oldPaymentMode() {
    return this.select('#oldPaymentMode');
  }

  get oldPaymentDate() {
    return this.input('#oldPaymentDate');
  }

  get oldCardNumber() {
    return this.input('#oldCardNumber');
  }

  get oldSave() {
    return this.button('#oldSave');
  }

  get oldCancel() {
    return this.button('#oldCancel');
  }
}

describe('PersonMembershipsComponent', () => {
  let person: PersonModel;
  let memberships: Array<MembershipModel>;
  let tester: PersonMembershipsComponentTester;
  let currentPersonReminderService: jasmine.SpyObj<CurrentPersonReminderService>;

  beforeEach(() => {
    jasmine.clock().mockDate(DateTime.fromISO('2020-04-30T15:30:00').toJSDate());

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
    currentPersonReminderService = jasmine.createSpyObj<CurrentPersonReminderService>(
      'CurrentPersonReminderService',
      ['refresh']
    );

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
        { provide: CurrentPersonReminderService, useValue: currentPersonReminderService },
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ],
      imports: [
        HttpClientTestingModule,
        GlobeNgbTestingModule,
        ReactiveFormsModule,
        ValdemortModule
      ]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue(person);

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

    tester = new PersonMembershipsComponentTester();
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should only display missing current membership when no membership', () => {
    tester.detectChanges();
    const component = tester.componentInstance;

    expect(component.person).toBe(person);
    expect(component.currentYear).toBe(2020);
    expect(component.currentMembership).toBeNull();
    expect(component.oldMemberships).toEqual([]);
    expect(component.membershipForm.value).toEqual({
      paymentMode: null,
      paymentDate: '2020-04-30',
      cardNumber: null
    });

    expect(tester.title).toHaveText(`Adhésion de l'année en cours (2020)`);
    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
    expect(tester.oldMemberships).toBeNull();

    expect(tester.alert).toContainText(`Pas d'adhésion pour l'année en cours.`);
  });

  it('should validate and create new membership', () => {
    tester.detectChanges();

    expect(tester.paymentMode).toHaveSelectedLabel('');
    expect(tester.paymentMode.optionLabels.length).toBe(PAYMENT_MODES.length);
    expect(tester.paymentMode.optionLabels[0]).toBe('');
    expect(tester.paymentMode.optionLabels[1]).toBe('Chèque');
    expect(tester.paymentMode.optionLabels[2]).toBe('Espèces');
    expect(tester.paymentDate).toHaveValue('30/04/2020');

    tester.paymentMode.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('Le mode de paiement est obligatoire');

    tester.paymentDate.fillWith('');
    tester.paymentDate.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('La date de paiement est obligatoire');

    tester.paymentDate.fillWith('01/05/2020');
    expect(tester.testElement).toContainText('La date de paiement doit être dans le passé');

    tester.paymentDate.fillWith('31/12/2019');
    expect(tester.testElement).toContainText(`La date de paiement doit être dans l'année en cours`);

    tester.paymentMode.selectIndex(1);
    tester.paymentDate.fillWith('30/04/2020');

    const membershipService: MembershipService = TestBed.inject(MembershipService);
    const newMembership: MembershipModel = {
      id: 56,
      year: 2020,
      paymentMode: 'CHECK',
      paymentDate: '2020-04-30',
      cardNumber: 2
    };
    spyOn(membershipService, 'createCurrent').and.returnValue(of(newMembership));
    spyOn(membershipService, 'list').and.returnValue(of([newMembership]));

    tester.save.click();

    expect(membershipService.createCurrent).toHaveBeenCalledWith(person.id, {
      year: 2020,
      paymentMode: 'CHECK',
      paymentDate: '2020-04-30',
      cardNumber: null
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
      cardNumber: 2
    });

    const component = tester.componentInstance;

    tester.detectChanges();

    expect(component.currentMembership).toBeNull();
    expect(component.oldMemberships).toEqual(memberships);

    expect(component.membershipForm.value).toEqual({
      paymentMode: null,
      paymentDate: '2020-04-30',
      cardNumber: null
    });

    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
    expect(tester.oldMemberships).not.toBeNull();

    expect(tester.alert).toContainText(`Pas d'adhésion pour l'année en cours.`);
    expect(tester.oldMemberships).toContainText('2017');
    expect(tester.oldMemberships).toContainText('31 janv. 2017');
    expect(tester.oldMemberships).toContainText('Chèque');
    expect(tester.oldMemberships).toContainText('2');
  });

  it('should display current membership when current membership exists', () => {
    memberships.push({
      id: 42,
      year: 2020,
      paymentMode: 'CHECK',
      paymentDate: '2020-01-31',
      cardNumber: 2
    });

    const component = tester.componentInstance;

    tester.detectChanges();

    expect(component.currentMembership).toEqual(memberships[0]);
    expect(component.oldMemberships).toEqual([]);

    expect(tester.noCurrentMembership).toBeNull();
    expect(tester.currentMembership).not.toBeNull();
    expect(tester.oldMemberships).toBeNull();

    expect(tester.alert).toContainText(`Payée (Chèque) le 31 janv. 2020.`);
    expect(tester.alert).toContainText(`Carte n° 2`);
  });

  it('should delete current membership if confirmed', () => {
    memberships.push({
      id: 42,
      year: 2020,
      paymentMode: 'CHECK',
      paymentDate: '2020-01-31',
      cardNumber: 2
    });

    tester.detectChanges();

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const membershipService: MembershipService = TestBed.inject(MembershipService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(membershipService, 'deleteCurrent').and.returnValue(of(undefined));
    spyOn(membershipService, 'list').and.returnValue(of([]));

    tester.delete.click();

    expect(membershipService.deleteCurrent).toHaveBeenCalledWith(person.id, 42);
    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
    expect(tester.oldMemberships).toBeNull();
  });

  it('should delete old membership if confirmed', () => {
    memberships.push({
      id: 42,
      year: 2019,
      paymentMode: 'CHECK',
      paymentDate: '2020-01-31',
      cardNumber: 2
    });

    tester.detectChanges();

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const membershipService: MembershipService = TestBed.inject(MembershipService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(membershipService, 'deleteOld').and.returnValue(of(undefined));
    spyOn(membershipService, 'list').and.returnValue(of([]));

    tester.deleteOld[0].click();

    expect(membershipService.deleteOld).toHaveBeenCalledWith(person.id, 42);
    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
    expect(tester.oldMemberships).toBeNull();
  });

  it('should validate and create old membership', () => {
    memberships.push({
      id: 42,
      year: 2019,
      paymentMode: 'CHECK',
      paymentDate: '2020-01-31',
      cardNumber: 2
    });

    tester.detectChanges();

    expect(tester.displayOldMembershipForm).not.toBeNull();
    expect(tester.oldMembershipForm).toBeNull();

    tester.displayOldMembershipForm.click();

    expect(tester.displayOldMembershipForm).toBeNull();
    expect(tester.oldMembershipForm).not.toBeNull();

    expect(tester.oldYear).toHaveSelectedLabel('');
    expect(tester.oldYear.optionLabels).toEqual(['', '2018']);
    expect(tester.oldPaymentMode).toHaveSelectedLabel('');
    expect(tester.oldPaymentMode.optionLabels.length).toBe(PAYMENT_MODES.length);
    expect(tester.oldPaymentMode.optionLabels[0]).toBe('');
    expect(tester.oldPaymentMode.optionLabels[1]).toBe('Chèque');
    expect(tester.oldPaymentMode.optionLabels[2]).toBe('Espèces');
    expect(tester.oldPaymentDate).toHaveValue('30/04/2020');
    expect(tester.oldCardNumber).toHaveValue('');

    tester.oldYear.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText(`L'année est obligatoire`);

    tester.oldPaymentMode.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('Le mode de paiement est obligatoire');

    tester.oldPaymentDate.fillWith('');
    tester.oldPaymentDate.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('La date de paiement est obligatoire');

    tester.oldPaymentDate.fillWith('01/05/2020');
    expect(tester.testElement).toContainText('La date de paiement doit être dans le passé');

    tester.oldCardNumber.dispatchEventOfType('blur');
    expect(tester.testElement).toContainText('Le n° de carte est obligatoire');

    tester.oldYear.selectLabel('2018');
    tester.oldPaymentMode.selectIndex(1);
    tester.oldPaymentDate.fillWith('30/04/2020');
    tester.oldCardNumber.fillWith('3');

    const membershipService: MembershipService = TestBed.inject(MembershipService);
    const newMembership: MembershipModel = {
      id: 56,
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2020-04-30',
      cardNumber: 3
    };
    spyOn(membershipService, 'createOld').and.returnValue(of(newMembership));
    spyOn(membershipService, 'list').and.returnValue(of([newMembership, ...memberships]));

    tester.oldSave.click();

    expect(membershipService.createOld).toHaveBeenCalledWith(person.id, {
      year: 2018,
      paymentMode: 'CHECK',
      paymentDate: '2020-04-30',
      cardNumber: 3
    });
    expect(tester.componentInstance.currentMembership).toBeNull();
    expect(tester.componentInstance.oldMemberships.length).toBe(2);
    expect(tester.noCurrentMembership).not.toBeNull();
    expect(tester.currentMembership).toBeNull();
  });

  it('should cancel old membership creation', () => {
    tester.detectChanges();

    expect(tester.displayOldMembershipForm).not.toBeNull();
    expect(tester.oldMembershipForm).toBeNull();

    tester.displayOldMembershipForm.click();

    expect(tester.displayOldMembershipForm).toBeNull();
    expect(tester.oldMembershipForm).not.toBeNull();

    tester.oldSave.click();
    expect(tester.testElement).toContainText(`L'année est obligatoire`);

    tester.oldCancel.click();

    expect(tester.displayOldMembershipForm).not.toBeNull();
    expect(tester.oldMembershipForm).toBeNull();

    tester.displayOldMembershipForm.click();

    expect(tester.displayOldMembershipForm).toBeNull();
    expect(tester.oldMembershipForm).not.toBeNull();
    expect(tester.testElement).not.toContainText(`L'année est obligatoire`);
  });
});
