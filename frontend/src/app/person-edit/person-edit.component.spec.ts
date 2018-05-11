import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FISCAL_NUMBER_PATTERN, PersonEditComponent } from './person-edit.component';
import { PersonService } from '../person.service';
import { CityModel, FiscalStatus, Gender, PersonIdentityModel, PersonModel } from '../models/person.model';
import { displayCity, DisplayCityPipe } from '../display-city.pipe';
import { DisplayMaritalStatusPipe, MARITAL_STATUS_TRANSLATIONS } from '../display-marital-status.pipe';
import { PersonCommand } from '../models/person.command';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DisplayGenderPipe } from '../display-gender.pipe';
import { DisplayHousingPipe } from '../display-housing.pipe';
import { DisplayFiscalStatusPipe } from '../display-fiscal-status.pipe';
import { DisplayHealthCareCoveragePipe } from '../display-health-care-coverage.pipe';
import { DisplayHealthInsurancePipe } from '../display-health-insurance.pipe';
import { FullnamePipe } from '../fullname.pipe';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { map } from 'rxjs/operators';
import { CountryModel } from '../models/country.model';
import { ComponentTester, TestButton, TestInput, speculoosMatchers } from 'ngx-speculoos';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { DisplayResidencePermitPipe } from '../display-residence-permit.pipe';
import { DisplayVisaPipe } from '../display-visa.pipe';

class PersonEditTester extends ComponentTester<PersonEditComponent> {
  constructor() {
    super(PersonEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get firstName() {
    return this.input('#firstName');
  }

  get lastName() {
    return this.input('#lastName');
  }

  get birthName() {
    return this.input('#birthName');
  }

  get nickName() {
    return this.input('#nickName');
  }

  gender(gender: Gender) {
    return this.input(`#gender${gender}`);
  }

  get birthDate() {
    return this.input('#birthDate');
  }

  mediationEnabled(yesOrNo: boolean) {
    return this.input(`#mediationEnabled${yesOrNo}`);
  }

  get mediationCode() {
    return this.element('#mediationCode');
  }

  get address() {
    return this.input('#address');
  }

  get city() {
    return this.input('#city');
  }

  get email() {
    return this.input('#email');
  }

  get phoneNumber() {
    return this.input('#phoneNumber');
  }

  get firstMediationAppointmentDate() {
    return this.input('#firstMediationAppointmentDate');
  }

  get maritalStatus() {
    return this.select('#maritalStatus');
  }

  get spouse() {
    return this.input('#spouse');
  }

  get entryDate() {
    return this.input('#entryDate');
  }

  get housing() {
    return this.select('#housing');
  }

  get housingSpace() {
    return this.input('#housingSpace');
  }

  get hostName() {
    return this.input('#hostName');
  }

  fiscalStatus(status: FiscalStatus) {
    return this.input(`#fiscalStatus${status}`);
  }

  get fiscalNumber() {
    return this.input('#fiscalNumber');
  }

  get fiscalStatusUpToDate() {
    return this.input('#fiscalStatusUpToDate');
  }

  get healthCareCoverage() {
    return this.select('#healthCareCoverage');
  }

  get healthCareCoverageStartDate() {
    return this.input('#healthCareCoverageStartDate');
  }

  get healthInsurance() {
    return this.select('#healthInsurance');
  }

  get healthInsuranceStartDate() {
    return this.input('#healthInsuranceStartDate');
  }

  get accompanying() {
    return this.input('#accompanying');
  }

  get socialSecurityNumber() {
    return this.input('#socialSecurityNumber');
  }

  get cafNumber() {
    return this.input('#cafNumber');
  }

  get nationality() {
    return this.input('#nationality');
  }

  get visa() {
    return this.select('#visa');
  }

  get residencePermit() {
    return this.select('#residencePermit');
  }

  get residencePermitDepositDate() {
    return this.input('#residencePermitDepositDate');
  }

  get residencePermitRenewalDate() {
    return this.input('#residencePermitRenewalDate');
  }

  get firstTypeaheadOption() {
    return this.button('ngb-typeahead-window button');
  }

  get save(): TestButton {
    return this.button('#save');
  }

  fillAndTick(input: TestInput, text: string) {
    input.fillWith(text);
    tick(500);
    this.detectChanges();
  }
}

describe('PersonEditComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };

  const persons = [
    {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe'
    },
    {
      id: 2,
      firstName: 'Jack',
      lastName: 'Malone'
    },
    {
      id: 42,
      firstName: 'John',
      lastName: 'Doe'
    }
  ] as Array<PersonIdentityModel>;

  const countries: Array<CountryModel> = [
    {
      id: 'BEL',
      name: 'Belgique'
    },
    {
      id: 'FRA',
      name: 'France'
    },
    {
      id: 'TUR',
      name: 'Turquie'
    }
  ];

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, GlobeNgbModule.forRoot(), ValdemortModule],
    declarations: [
      PersonEditComponent,
      DisplayMaritalStatusPipe,
      DisplayCityPipe,
      DisplayGenderPipe,
      DisplayHousingPipe,
      DisplayFiscalStatusPipe,
      DisplayHealthCareCoveragePipe,
      DisplayHealthInsurancePipe,
      DisplayVisaPipe,
      DisplayResidencePermitPipe,
      FullnamePipe,
      ValidationDefaultsComponent
    ]
  })
  class TestModule {
  }

  describe('in edit mode', () => {
    const person: PersonModel = {
      id: 42,
      firstName: 'John',
      lastName: 'Doe',
      birthName: 'Abba',
      nickName: 'john',
      mediationCode: 'D1',
      address: 'Chemin de la gare',
      birthDate: '1980-01-01',
      city: cityModel,
      email: 'john@mail.com',
      entryDate: '2016-12-01',
      gender: 'MALE',
      phoneNumber: '06 12 34 56 78',
      mediationEnabled: true,
      firstMediationAppointmentDate: '2017-12-01',
      maritalStatus: 'MARRIED',
      spouse: {
        id: 43,
        firstName: 'Jane',
        lastName: 'Doe',
        nickName: null,
        mediationCode: 'D2'
      },
      housing: 'F4',
      housingSpace: 80,
      hostName: 'Bruno Mala',
      fiscalStatus: 'TAXABLE',
      fiscalStatusUpToDate: true,
      fiscalNumber: '0123456789012',
      healthCareCoverage: 'AME',
      healthCareCoverageStartDate: '2017-01-01',
      healthInsurance: 'MUTUELLE',
      healthInsuranceStartDate: '2017-02-02',
      accompanying: 'Paul',
      socialSecurityNumber: '234765498056734',
      cafNumber: '56734',
      nationality: {
        id: 'FRA',
        name: 'France'
      },
      visa: 'LONG_STAY',
      residencePermit: 'TEN_YEAR_OLD_RESIDENT',
      residencePermitDepositDate: '2018-02-02',
      residencePermitRenewalDate: '2018-10-02',
      deleted: false
    };

    const activatedRoute = {
      snapshot: {data: {person, persons, countries}}
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{provide: ActivatedRoute, useValue: activatedRoute}]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    }));

    beforeEach(() => jasmine.addMatchers(speculoosMatchers));

    it('should have a title', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      expect(tester.title).toHaveText('Modification de l\'adhérent John Doe (john)');
    });

    it('should edit and update an existing person', () => {
      const personService = TestBed.get(PersonService);
      spyOn(personService, 'update').and.returnValue(of(person));
      const router = TestBed.get(Router);
      spyOn(router, 'navigate');

      const tester = new PersonEditTester();
      tester.detectChanges();

      expect(tester.firstName).toHaveValue(person.firstName);
      expect(tester.lastName).toHaveValue(person.lastName);
      expect(tester.birthName).toHaveValue(person.birthName);
      expect(tester.nickName).toHaveValue(person.nickName);
      expect(tester.gender('MALE')).toBeChecked();
      expect(tester.birthDate).toHaveValue('01/01/1980');
      expect(tester.mediationCode).toHaveText(' Généré automatiquement ');
      expect(tester.address).toHaveValue(person.address);
      expect(tester.city).toHaveValue(displayCity(person.city));
      expect(tester.email).toHaveValue(person.email);
      expect(tester.phoneNumber).toHaveValue(person.phoneNumber);
      expect(tester.firstMediationAppointmentDate).toHaveValue('01/12/2017');
      expect(tester.maritalStatus).toHaveSelectedValue(person.maritalStatus);
      expect(tester.spouse).toHaveValue('Jane Doe');
      expect(tester.entryDate).toHaveValue('01/12/2016');
      expect(tester.housing).toHaveSelectedValue(person.housing);
      expect(tester.housingSpace).toHaveValue(`${person.housingSpace}`);
      expect(tester.hostName).toHaveValue(person.hostName);
      expect(tester.fiscalStatus('UNKNOWN')).not.toBeChecked();
      expect(tester.fiscalStatus('NOT_TAXABLE')).not.toBeChecked();
      expect(tester.fiscalStatus('TAXABLE')).toBeChecked();
      expect(tester.fiscalNumber).toHaveValue('0123456789012');
      expect(tester.fiscalStatusUpToDate).toBeChecked();
      expect(tester.healthCareCoverage).toHaveSelectedValue(person.healthCareCoverage);
      expect(tester.healthCareCoverageStartDate).toHaveValue('01/01/2017');
      expect(tester.healthInsurance).toHaveSelectedValue(person.healthInsurance);
      expect(tester.healthInsuranceStartDate).toHaveValue('02/02/2017');
      expect(tester.accompanying).toHaveValue(person.accompanying);
      expect(tester.socialSecurityNumber).toHaveValue(person.socialSecurityNumber);
      expect(tester.cafNumber).toHaveValue(person.cafNumber);
      expect(tester.nationality).toHaveValue(person.nationality.name);
      expect(tester.visa).toHaveSelectedValue(person.visa);
      expect(tester.residencePermit).toHaveSelectedValue(person.residencePermit);
      expect(tester.residencePermitDepositDate).toHaveValue('02/02/2018');
      expect(tester.residencePermitRenewalDate).toHaveValue('02/10/2018');

      tester.lastName.fillWith('Do');

      tester.save.click();

      expect(personService.update).toHaveBeenCalled();

      const idUpdated = personService.update.calls.argsFor(0)[0];
      expect(idUpdated).toBe(42);
      const personUpdated = personService.update.calls.argsFor(0)[1];
      expect(personUpdated.lastName).toBe('Do');
      expect(personUpdated.firstName).toBe('John');

      expect(router.navigate).toHaveBeenCalledWith(['persons', 42]);
    });

    it('should clear the city input on blur if not valid anymore', () =>  {
      const tester = new PersonEditTester();

      // fake typeahead results
      tester.componentInstance.cityTypeahead.searcher = (text: Observable<string>) => text.pipe(map(() => []));

      tester.detectChanges();

      expect(tester.city).toHaveValue(displayCity(person.city));

      // erase something in the field, which should make its model null
      tester.city.fillWith('42000 SAINT-ETIENN');

      expect(tester.componentInstance.personForm.value.city).toBeFalsy();
      expect(tester.city).toHaveClass('is-warning');

      // move out of the field, which should clear it
      tester.city.dispatchEventOfType('blur');

      expect(tester.city.value).toBeFalsy();
    });

    it('should clear the spouse input on blur if not valid anymore', () =>  {
      const tester = new PersonEditTester();

      // fake typeahead results
      tester.componentInstance.spouseTypeahead.searcher = (text: Observable<string>) => text.pipe(map(() => []));

      tester.detectChanges();

      expect(tester.spouse).toHaveValue('Jane Doe');

      // erase something in the field, which should make its model null
      tester.spouse.fillWith('Jane');

      expect(tester.componentInstance.personForm.value.spouse).toBeFalsy();
      expect(tester.spouse).toHaveClass('is-warning');

      // move out of the field, which should clear it
      tester.spouse.dispatchEventOfType('blur');

      expect(tester.spouse.value).toBeFalsy();
    });

    it('should warn if selecting a spouse already in couple with someone else', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();
      const component = tester.componentInstance;

      const personService = TestBed.get(PersonService);
      spyOn(personService, 'get').and.returnValue(of({ spouse: { id: 54 } }));

      component.personForm.get('spouse').setValue({ id: 17, firstName: 'Jackie', lastName: 'Doe' });
      tester.detectChanges();

      expect(component.spouseIsInCouple).toBe(true);
      expect(tester.nativeElement.textContent).toContain(`Jackie Doe est déjà en couple avec quelqu'un d'autre`);
    });

    it('should not warn if selecting a spouse not already in couple with someone else', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();
      const nativeElement = tester.nativeElement;
      const component = tester.componentInstance;

      const personService = TestBed.get(PersonService);
      spyOn(personService, 'get').and.returnValue(of({ spouse: null }));

      component.personForm.get('spouse').setValue({ id: 17, firstName: 'Jackie', lastName: 'Doe' });
      tester.detectChanges();

      expect(component.spouseIsInCouple).toBe(false);
      expect(nativeElement.textContent).not.toContain(`Jackie Doe est déjà en couple avec quelqu'un d'autre`);
    });

    it('should not warn if selecting the current spouse of the edited person', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();
      const nativeElement = tester.nativeElement;
      const component = tester.componentInstance;

      const personService = TestBed.get(PersonService);
      spyOn(personService, 'get').and.returnValue(of({ spouse: { id: 42 } }));

      component.personForm.get('spouse').setValue({ id: 43, firstName: 'Jane', lastName: 'Doe' });
      tester.detectChanges();

      expect(component.spouseIsInCouple).toBe(false);
      expect(nativeElement.textContent).not.toContain(`Jane Doe est déjà en couple avec quelqu'un d'autre`);
    });

    it('should set the fiscal number to null if invalid when setting the fiscal status to UNKNONW', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();
      const component = tester.componentInstance;

      tester.fiscalNumber.fillWith('INVALID');
      tester.fiscalStatus('UNKNOWN').check();

      expect(tester.fiscalNumber).toBeNull();
      expect(component.personForm.get('fiscalNumber').value).toBeNull();
    });
  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: {data: {person: null as PersonModel, persons, countries}}
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{provide: ActivatedRoute, useValue: activatedRoute}]
    })));

    beforeEach(() => jasmine.addMatchers(speculoosMatchers));

    it('should have a title', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      expect(tester.title).toHaveText('Nouvel adhérent');
    });

    it('should create and save a new person', fakeAsync(() => {
      const personService = TestBed.get(PersonService);
      spyOn(personService, 'create').and.returnValue(of({id: 43} as PersonModel));
      const router = TestBed.get(Router);
      spyOn(router, 'navigate');
      const tester = new PersonEditTester();

      // fake typeahead results
      tester.componentInstance.cityTypeahead.searcher = (text: Observable<string>) => of([cityModel]);
      tester.detectChanges();

      expect(tester.firstName).toHaveValue('');
      expect(tester.lastName).toHaveValue('');
      expect(tester.birthName).toHaveValue('');
      expect(tester.nickName).toHaveValue('');
      expect(tester.gender('MALE')).not.toBeChecked();
      expect(tester.gender('FEMALE')).not.toBeChecked();
      expect(tester.gender('OTHER')).not.toBeChecked();
      expect(tester.birthDate).toHaveValue('');
      expect(tester.address).toHaveValue('');
      expect(tester.city).toHaveValue('');
      expect(tester.email).toHaveValue('');
      expect(tester.phoneNumber).toHaveValue('');

      expect(tester.mediationEnabled(true)).not.toBeChecked();
      expect(tester.mediationEnabled(false)).toBeChecked();

      const mediationDependantIds = [
        'mediationCode',
        'firstMediationAppointmentDate',
        'maritalStatus',
        'entryDate',
        'housing',
        'hostName',
        'fiscalStatusUNKNOWN',
        'socialSecurityNumber',
        'accompanying',
        'cafNumber',
        'nationality'
      ];

      mediationDependantIds.forEach(id => {
        expect(tester.element(`#${id}`)).toBeNull(`#${id} should be absent`);
      });

      tester.mediationEnabled(true).check();

      mediationDependantIds.forEach(id => {
        expect(tester.element(`#${id}`)).not.toBeNull(`#${id} should be present`);
      });

      expect(tester.mediationCode).toHaveText(' Généré automatiquement ');
      expect(tester.firstMediationAppointmentDate).toHaveValue('');
      expect(tester.maritalStatus).toHaveSelectedValue('UNKNOWN');
      expect(tester.spouse).toHaveValue('');
      expect(tester.entryDate).toHaveValue('');
      expect(tester.housing).toHaveSelectedValue('UNKNOWN');
      expect(tester.housingSpace).toBeFalsy();
      expect(tester.hostName).toHaveValue('');
      expect(tester.fiscalStatus('UNKNOWN')).toBeChecked();
      expect(tester.fiscalNumber).toBeFalsy();
      expect(tester.fiscalStatusUpToDate).toBeFalsy();
      expect(tester.accompanying).toHaveValue('');
      expect(tester.socialSecurityNumber).toHaveValue('');
      expect(tester.cafNumber).toHaveValue('');
      expect(tester.healthCareCoverage).toHaveSelectedValue('UNKNOWN');
      expect(tester.healthCareCoverageStartDate).toBeFalsy();
      expect(tester.healthInsurance).toHaveSelectedValue('UNKNOWN');
      expect(tester.healthInsuranceStartDate).toBeFalsy();
      expect(tester.nationality).toHaveValue('');
      expect(tester.visa).toHaveSelectedValue('UNKNOWN');
      expect(tester.residencePermit).toHaveSelectedValue('UNKNOWN');
      expect(tester.residencePermitDepositDate).toHaveValue('');
      expect(tester.residencePermitRenewalDate).toHaveValue('');

      tester.lastName.fillWith('Doe');
      tester.firstName.fillWith('Jane');
      tester.birthName.fillWith('Jos');
      tester.nickName.fillWith('jane');
      tester.gender('FEMALE').check();
      tester.birthDate.fillWith('03/03/1985');
      tester.address.fillWith('Avenue Liberté');

      // trigger city typeahead
      tester.fillAndTick(tester.city, '4200');
      // select first result
      const cityResult = tester.firstTypeaheadOption;
      expect(cityResult).toHaveText(displayCity(cityModel));
      cityResult.click();

      tester.email.fillWith('jane@mail.com');
      tester.phoneNumber.fillWith('06 13 13 13 13');

      tester.maritalStatus.selectIndex(2);

      // trigger spouse typeahead
      spyOn(personService, 'get').and.returnValue(of({ spouse: null }));
      tester.fillAndTick(tester.spouse, 'Jane');
      // select first result
      const spouseResult = tester.firstTypeaheadOption;
      expect(spouseResult).toHaveText('Jane Doe');
      spouseResult.click();

      tester.entryDate.fillWith('02/02/2015');
      tester.firstMediationAppointmentDate.fillWith('02/02/2017');
      tester.housing.selectIndex(1);
      expect(tester.housingSpace).toBeTruthy();
      tester.housingSpace.fillWith('30');
      tester.hostName.fillWith('Bruno');
      tester.accompanying.fillWith('Paulette');
      tester.socialSecurityNumber.fillWith('453287654309876');
      tester.cafNumber.fillWith('78654');

      tester.fiscalStatus('TAXABLE').check();
      expect(tester.fiscalNumber).toBeTruthy();
      tester.fiscalNumber.fillWith('0123456789012');
      expect(tester.fiscalStatusUpToDate).toBeTruthy();
      tester.fiscalStatusUpToDate.check();

      tester.healthCareCoverage.selectIndex(1);
      expect(tester.healthCareCoverageStartDate).toBeTruthy();
      tester.healthCareCoverageStartDate.fillWith('01/01/2017');

      tester.healthInsurance.selectIndex(1);
      expect(tester.healthInsuranceStartDate).toBeTruthy();
      tester.healthInsuranceStartDate.fillWith('02/02/2017');

      // trigger nationality typeahead
      tester.fillAndTick(tester.nationality, 'Bel');
      // select first result
      expect(tester.firstTypeaheadOption).toHaveText('Belgique');
      tester.firstTypeaheadOption.click();

      tester.save.click();

      expect(personService.create).toHaveBeenCalled();

      const createdPerson = personService.create.calls.argsFor(0)[0] as PersonCommand;
      expect(createdPerson.lastName).toBe('Doe');
      expect(createdPerson.firstName).toBe('Jane');
      expect(createdPerson.birthName).toBe('Jos');
      expect(createdPerson.nickName).toBe('jane');
      expect(createdPerson.gender).toBe('FEMALE');
      expect(createdPerson.birthDate).toBe('1985-03-03');
      expect(createdPerson.mediationEnabled).toBe(true);
      expect(createdPerson.mediationCode).toBeUndefined();
      expect(createdPerson.address).toBe('Avenue Liberté');
      expect(createdPerson.city.code).toBe(42000);
      expect(createdPerson.city.city).toBe('SAINT-ETIENNE');
      expect(createdPerson.email).toBe('jane@mail.com');
      expect(createdPerson.phoneNumber).toBe('06 13 13 13 13');
      expect(createdPerson.firstMediationAppointmentDate).toBe('2017-02-02');
      expect(createdPerson.maritalStatus).toBe(MARITAL_STATUS_TRANSLATIONS[2].key);
      expect(createdPerson.spouseId).toBe(1);
      expect((createdPerson as any).spouse).not.toBeDefined();
      expect(createdPerson.entryDate).toBe('2015-02-02');
      expect(createdPerson.housing).toBe('F0');
      expect(createdPerson.housingSpace).toBe(30);
      expect(createdPerson.hostName).toBe('Bruno');
      expect(createdPerson.accompanying).toBe('Paulette');
      expect(createdPerson.socialSecurityNumber).toBe('453287654309876');
      expect(createdPerson.cafNumber).toBe('78654');
      expect(createdPerson.fiscalStatus).toBe('TAXABLE');
      expect(createdPerson.fiscalNumber).toBe('0123456789012');
      expect(createdPerson.fiscalStatusUpToDate).toBe(true);
      expect(createdPerson.healthCareCoverage).toBe('GENERAL');
      expect(createdPerson.healthCareCoverageStartDate).toBe('2017-01-01');
      expect(createdPerson.healthInsurance).toBe('CMUC');
      expect(createdPerson.healthInsuranceStartDate).toBe('2017-02-02');
      expect((createdPerson as any).nationality).not.toBeDefined();
      expect(createdPerson.nationalityId).toBe('BEL');
      expect(createdPerson.visa).toBe('UNKNOWN');
      expect(createdPerson.residencePermit).toBe('UNKNOWN');
      expect(createdPerson.residencePermitDepositDate).toBe(null);
      expect(createdPerson.residencePermitRenewalDate).toBe(null);

      expect(router.navigate).toHaveBeenCalledWith(['persons', 43]);
    }));

    it('should accept only 13 digits for the fiscal number', () => {
      expect(FISCAL_NUMBER_PATTERN.test('1abcdefghijk2')).toBeFalsy();
      expect(FISCAL_NUMBER_PATTERN.test('123456789012')).toBeFalsy();
      expect(FISCAL_NUMBER_PATTERN.test('12345678901234')).toBeFalsy();
      expect(FISCAL_NUMBER_PATTERN.test('1234567890123')).toBeTruthy();
    });
  });
});
