import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FISCAL_NUMBER_PATTERN, PersonEditComponent } from './person-edit.component';
import { PersonService } from '../person.service';
import {
  CityModel,
  FiscalStatus,
  Gender,
  PassportStatus,
  PersonIdentityModel,
  PersonModel
} from '../models/person.model';
import { displayCity, DisplayCityPipe } from '../display-city.pipe';
import {
  DisplayMaritalStatusPipe,
  MARITAL_STATUS_TRANSLATIONS
} from '../display-marital-status.pipe';
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
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { filter, map } from 'rxjs/operators';
import { CountryModel } from '../models/country.model';
import { ComponentTester, TestInput } from 'ngx-speculoos';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { DisplayResidencePermitPipe } from '../display-residence-permit.pipe';
import { DisplayVisaPipe } from '../display-visa.pipe';
import { PageTitleDirective } from '../page-title.directive';
import { DisplayEntryTypePipe } from '../display-entry-type.pipe';
import { DisplayPassportStatusPipe } from '../display-passport-status.pipe';

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

  get mediationSection() {
    return this.element('#mediation-section');
  }

  get mediationCode() {
    return this.mediationSection.element('#mediationCode');
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
    return this.mediationSection.input('#firstMediationAppointmentDate');
  }

  get maritalStatus() {
    return this.mediationSection.select('#maritalStatus');
  }

  spouseType(type: 'none' | 'spouse' | 'partner') {
    return this.input(`#spouse-type-${type}`);
  }

  get spouse() {
    return this.input('#spouse');
  }

  get partner() {
    return this.input('#partner');
  }

  get entryDate() {
    return this.mediationSection.input('#entryDate');
  }

  get entryType() {
    return this.mediationSection.select('#entryType');
  }

  get housing() {
    return this.mediationSection.select('#housing');
  }

  get housingSpaceSection() {
    return this.mediationSection.element('#housingSpace-section');
  }

  get housingSpace() {
    return this.housingSpaceSection.input('#housingSpace');
  }

  get hostName() {
    return this.mediationSection.input('#hostName');
  }

  fiscalStatus(status: FiscalStatus) {
    return this.mediationSection.input(`#fiscalStatus${status}`);
  }

  get fiscalSection() {
    return this.mediationSection.element('#fiscal-section');
  }

  get fiscalNumber() {
    return this.fiscalSection.input('#fiscalNumber');
  }

  get fiscalStatusUpToDate() {
    return this.fiscalSection.input('#fiscalStatusUpToDate');
  }

  get healthCareCoverage() {
    return this.mediationSection.select('#healthCareCoverage');
  }

  get healthCareCoverageStartDate() {
    return this.mediationSection.input('#healthCareCoverageStartDate');
  }

  get healthInsurance() {
    return this.mediationSection.select('#healthInsurance');
  }

  get healthInsuranceStartDate() {
    return this.mediationSection.input('#healthInsuranceStartDate');
  }

  get accompanying() {
    return this.mediationSection.input('#accompanying');
  }

  get socialSecurityNumber() {
    return this.mediationSection.input('#socialSecurityNumber');
  }

  get cafNumber() {
    return this.mediationSection.input('#cafNumber');
  }

  get nationality() {
    return this.mediationSection.input('#nationality');
  }

  passportStatus(status: PassportStatus) {
    return this.mediationSection.input(`#passportStatus${status}`);
  }

  get passportSection() {
    return this.mediationSection.element('#passport-section');
  }

  get passportNumber() {
    return this.passportSection.input('#passportNumber');
  }

  get passportValidityStartDate() {
    return this.passportSection.input('#passportValidityStartDate');
  }

  get passportValidityEndDate() {
    return this.passportSection.input('#passportValidityEndDate');
  }

  get visa() {
    return this.mediationSection.select('#visa');
  }

  get residencePermit() {
    return this.mediationSection.select('#residencePermit');
  }

  get residencePermitDepositDate() {
    return this.mediationSection.input('#residencePermitDepositDate');
  }

  get residencePermitRenewalDate() {
    return this.mediationSection.input('#residencePermitRenewalDate');
  }

  get residencePermitValidityStartDate() {
    return this.mediationSection.input('#residencePermitValidityStartDate');
  }

  get residencePermitValidityEndDate() {
    return this.mediationSection.input('#residencePermitValidityEndDate');
  }

  get firstTypeaheadOption() {
    return this.button('ngb-typeahead-window button');
  }

  get save() {
    return this.button('#save');
  }

  get similarPersonWarning() {
    return this.element('#similar-person-warning');
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

  let personService: PersonService;

  @NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterTestingModule,
      GlobeNgbTestingModule,
      ValdemortModule
    ],
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
      DisplayEntryTypePipe,
      DisplayPassportStatusPipe,
      FullnamePipe,
      ValidationDefaultsComponent,
      PageTitleDirective
    ]
  })
  class TestModule {}

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
      entryType: 'REGULAR',
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
      partner: null,
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
      passportStatus: 'PASSPORT',
      passportNumber: 'P1',
      passportValidityStartDate: '2019-09-01',
      passportValidityEndDate: '2024-09-01',
      visa: 'LONG_STAY',
      residencePermit: 'TEN_YEAR_OLD_RESIDENT',
      residencePermitDepositDate: '2018-02-02',
      residencePermitRenewalDate: '2018-10-02',
      residencePermitValidityStartDate: '2019-03-02',
      residencePermitValidityEndDate: '2029-03-02',
      deathDate: null,
      deleted: false
    };

    const activatedRoute = {
      snapshot: { data: { person, persons, countries } }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
      personService = TestBed.inject(PersonService);
    });

    it('should have a title', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      expect(tester.title).toHaveText("Modification de l'adhérent John Doe (john)");
    });

    it('should edit and update an existing person', () => {
      const spiedUpdate = spyOn(personService, 'update').and.returnValue(of(undefined));
      const router = TestBed.inject(Router);
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
      expect(tester.spouseType('none')).not.toBeChecked();
      expect(tester.spouseType('spouse')).toBeChecked();
      expect(tester.spouseType('partner')).not.toBeChecked();
      expect(tester.spouse).toHaveValue('Jane Doe');
      expect(tester.partner).toBeNull();
      expect(tester.entryDate).toHaveValue('01/12/2016');
      expect(tester.entryType).toHaveSelectedValue(person.entryType);
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
      expect(tester.passportStatus('PASSPORT')).toBeChecked();
      expect(tester.passportNumber).toHaveValue(person.passportNumber);
      expect(tester.passportValidityStartDate).toHaveValue('01/09/2019');
      expect(tester.passportValidityEndDate).toHaveValue('01/09/2024');
      expect(tester.visa).toHaveSelectedValue(person.visa);
      expect(tester.residencePermit).toHaveSelectedValue(person.residencePermit);
      expect(tester.residencePermitDepositDate).toHaveValue('02/02/2018');
      expect(tester.residencePermitRenewalDate).toHaveValue('02/10/2018');
      expect(tester.residencePermitValidityStartDate).toHaveValue('02/03/2019');
      expect(tester.residencePermitValidityEndDate).toHaveValue('02/03/2029');

      tester.lastName.fillWith('Do');

      tester.save.click();

      expect(spiedUpdate).toHaveBeenCalled();

      const idUpdated = spiedUpdate.calls.argsFor(0)[0];
      expect(idUpdated).toBe(42);
      const personUpdated = spiedUpdate.calls.argsFor(0)[1];
      expect(personUpdated.lastName).toBe('Do');
      expect(personUpdated.firstName).toBe('John');
      expect(personUpdated.partner).toBeNull();

      expect(router.navigate).toHaveBeenCalledWith(['persons', 42]);
    });

    it('should save with a partner and ignore the spouse', () => {
      const spiedUpdate = spyOn(personService, 'update').and.returnValue(of(undefined));
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      const tester = new PersonEditTester();
      tester.detectChanges();

      tester.spouseType('partner').check();
      expect(tester.spouseType('none')).not.toBeChecked();
      expect(tester.spouseType('spouse')).not.toBeChecked();
      expect(tester.spouseType('partner')).toBeChecked();
      tester.partner.fillWith('Mary Doe');

      tester.save.click();

      expect(spiedUpdate).toHaveBeenCalled();

      const personUpdated = spiedUpdate.calls.argsFor(0)[1];
      expect(personUpdated.partner).toBe('Mary Doe');
      expect(personUpdated.spouseId).toBeNull();
    });

    it('should save with no spouse and no partner', () => {
      const spiedUpdate = spyOn(personService, 'update').and.returnValue(of(undefined));
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      const tester = new PersonEditTester();
      tester.detectChanges();

      tester.spouseType('partner').check();
      tester.partner.fillWith('Mary doe');

      tester.spouseType('none').check();
      expect(tester.spouseType('none')).toBeChecked();
      expect(tester.spouseType('spouse')).not.toBeChecked();
      expect(tester.spouseType('partner')).not.toBeChecked();

      tester.save.click();

      expect(spiedUpdate).toHaveBeenCalled();

      const personUpdated = spiedUpdate.calls.argsFor(0)[1];
      expect(personUpdated.partner).toBeNull();
      expect(personUpdated.spouseId).toBeNull();
    });

    it('should clear the city input on blur if not valid anymore', () => {
      const tester = new PersonEditTester();

      // fake typeahead results
      tester.componentInstance.cityTypeahead.searcher = (text: Observable<string>) =>
        text.pipe(map(() => []));

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

    it('should clear the spouse input on blur if not valid anymore', () => {
      const tester = new PersonEditTester();

      // fake typeahead results
      tester.componentInstance.spouseTypeahead.searcher = (text: Observable<string>) =>
        text.pipe(map(() => []));

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

      spyOn(personService, 'get').and.returnValue(of({ spouse: { id: 54 } } as PersonModel));

      component.personForm.get('spouse').setValue({ id: 17, firstName: 'Jackie', lastName: 'Doe' });
      tester.detectChanges();

      expect(component.spouseIsInCouple).toBe(true);
      expect(tester.nativeElement.textContent).toContain(
        `Jackie Doe est déjà en couple avec quelqu'un d'autre`
      );
    });

    it('should not warn if selecting a spouse not already in couple with someone else', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();
      const nativeElement = tester.nativeElement;
      const component = tester.componentInstance;

      spyOn(personService, 'get').and.returnValue(of({ spouse: null } as PersonModel));

      component.personForm.get('spouse').setValue({ id: 17, firstName: 'Jackie', lastName: 'Doe' });
      tester.detectChanges();

      expect(component.spouseIsInCouple).toBe(false);
      expect(nativeElement.textContent).not.toContain(
        `Jackie Doe est déjà en couple avec quelqu'un d'autre`
      );
    });

    it('should not warn if selecting the current spouse of the edited person', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();
      const nativeElement = tester.nativeElement;
      const component = tester.componentInstance;

      spyOn(personService, 'get').and.returnValue(of({ spouse: { id: 42 } } as PersonModel));

      component.personForm.get('spouse').setValue({ id: 43, firstName: 'Jane', lastName: 'Doe' });
      tester.detectChanges();

      expect(component.spouseIsInCouple).toBe(false);
      expect(nativeElement.textContent).not.toContain(
        `Jane Doe est déjà en couple avec quelqu'un d'autre`
      );
    });

    it('should set the fiscal number to null if invalid when setting the fiscal status to UNKNONW', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      tester.fiscalNumber.fillWith('INVALID');
      tester.fiscalStatus('UNKNOWN').check();

      expect(tester.fiscalSection).not.toBeVisible();
      expect(tester.fiscalNumber).toHaveValue('');
    });

    it('should set the passport fields to null if passport status is not PASSPORT', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      tester.passportStatus('NO_PASSPORT').check();

      const spiedUpdate = spyOn(personService, 'update').and.returnValue(of(undefined));
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      tester.save.click();

      expect(spiedUpdate).toHaveBeenCalled();

      const personUpdated: PersonCommand = spiedUpdate.calls.argsFor(0)[1];
      expect(personUpdated.passportNumber).toBeNull();
      expect(personUpdated.passportValidityStartDate).toBeNull();
      expect(personUpdated.passportValidityEndDate).toBeNull();
    });

    it('should validate the residence permit validity', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      tester.residencePermitValidityEndDate.fillWith(tester.residencePermitValidityStartDate.value);
      tester.save.click();
      const error =
        'La date de fin de validité doit être ultérieure à la date de début de validité';
      expect(tester.testElement).toContainText(error);

      tester.residencePermitValidityStartDate.fillWith('');
      expect(tester.testElement).not.toContainText(error);
    });

    it('should validate the passport validity only when status is PASSPORT', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      tester.passportValidityEndDate.fillWith(tester.passportValidityStartDate.value);
      tester.save.click();
      const error =
        'La date de fin de validité doit être ultérieure à la date de début de validité';
      expect(tester.testElement).toContainText(error);

      tester.passportStatus('NO_PASSPORT').check();
      expect(tester.testElement).not.toContainText(error);
      expect(tester.componentInstance.personForm.valid).toBe(true);
    });
  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: { person: null as PersonModel, persons, countries } }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      personService = TestBed.inject(PersonService);
    });

    it('should have a title', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      expect(tester.title).toHaveText('Nouvel adhérent');
    });

    it('should create and save a new person', fakeAsync(() => {
      const spiedCreate = spyOn(personService, 'create').and.returnValue(
        of({ id: 43 } as PersonModel)
      );
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      const tester = new PersonEditTester();

      // fake typeahead results
      tester.componentInstance.cityTypeahead.searcher = (text: Observable<string>) =>
        text.pipe(
          filter(v => !!v),
          map(() => [cityModel])
        );
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
      expect(tester.mediationSection).not.toBeVisible();

      tester.mediationEnabled(true).check();

      expect(tester.mediationSection).toBeVisible();

      expect(tester.mediationCode).toHaveText(' Généré automatiquement ');
      expect(tester.firstMediationAppointmentDate).toHaveValue('');
      expect(tester.maritalStatus).toHaveSelectedValue('UNKNOWN');
      expect(tester.spouseType('none')).toBeChecked();
      expect(tester.spouse).toBeNull();
      expect(tester.partner).toBeNull();
      expect(tester.entryDate).toHaveValue('');
      expect(tester.entryType).toHaveSelectedValue('UNKNOWN');
      expect(tester.housing).toHaveSelectedValue('UNKNOWN');
      expect(tester.housingSpaceSection).not.toBeVisible();
      expect(tester.housingSpace).toHaveValue('');
      expect(tester.hostName).toHaveValue('');
      expect(tester.fiscalStatus('UNKNOWN')).toBeChecked();
      expect(tester.fiscalSection).not.toBeVisible();
      expect(tester.fiscalNumber).toHaveValue('');
      expect(tester.fiscalStatusUpToDate).not.toBeChecked();
      expect(tester.accompanying).toHaveValue('');
      expect(tester.socialSecurityNumber).toHaveValue('');
      expect(tester.cafNumber).toHaveValue('');
      expect(tester.healthCareCoverage).toHaveSelectedValue('UNKNOWN');
      expect(tester.healthCareCoverageStartDate).toBeFalsy();
      expect(tester.healthInsurance).toHaveSelectedValue('UNKNOWN');
      expect(tester.healthInsuranceStartDate).toBeFalsy();
      expect(tester.nationality).toHaveValue('');
      expect(tester.passportStatus('UNKNOWN')).toBeChecked();
      expect(tester.passportSection).not.toBeVisible();
      expect(tester.visa).toHaveSelectedValue('UNKNOWN');
      expect(tester.residencePermit).toHaveSelectedValue('UNKNOWN');
      expect(tester.residencePermitDepositDate).toHaveValue('');
      expect(tester.residencePermitRenewalDate).toHaveValue('');
      expect(tester.residencePermitValidityStartDate).toHaveValue('');
      expect(tester.residencePermitValidityEndDate).toHaveValue('');

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

      tester.spouseType('spouse').check();
      // trigger spouse typeahead
      spyOn(personService, 'get').and.returnValue(of({ spouse: null } as PersonModel));
      tester.fillAndTick(tester.spouse, 'Jane');
      // select first result
      const spouseResult = tester.firstTypeaheadOption;
      expect(spouseResult).toHaveText('Jane Doe');
      spouseResult.click();

      tester.entryDate.fillWith('02/02/2015');
      tester.entryType.selectLabel('Irrégulière');
      tester.firstMediationAppointmentDate.fillWith('02/02/2017');
      tester.housing.selectLabel('Aucun');
      expect(tester.housingSpaceSection).not.toBeVisible();
      tester.housing.selectLabel('115');
      expect(tester.housingSpaceSection).not.toBeVisible();
      tester.housing.selectLabel('F0');
      expect(tester.housingSpaceSection).toBeVisible();
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

      tester.healthCareCoverage.selectLabel('Régime général');
      expect(tester.healthCareCoverageStartDate).toBeTruthy();
      tester.healthCareCoverageStartDate.fillWith('01/01/2017');

      tester.healthInsurance.selectLabel('CMU-C');
      expect(tester.healthInsuranceStartDate).toBeTruthy();
      tester.healthInsuranceStartDate.fillWith('02/02/2017');

      // trigger nationality typeahead
      tester.fillAndTick(tester.nationality, 'Bel');
      // select first result
      expect(tester.firstTypeaheadOption).toHaveText('Belgique');
      tester.firstTypeaheadOption.click();

      tester.passportStatus('PASSPORT').check();
      expect(tester.passportSection).toBeVisible();
      tester.passportNumber.fillWith('P1');
      tester.passportValidityStartDate.fillWith('01/09/2019');
      tester.passportValidityEndDate.fillWith('01/09/2024');

      tester.residencePermitValidityStartDate.fillWith('02/03/2019');
      tester.residencePermitValidityEndDate.fillWith('02/03/2029');

      tester.save.click();

      expect(spiedCreate).toHaveBeenCalled();

      const createdPerson = spiedCreate.calls.argsFor(0)[0] as PersonCommand;
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
      expect(createdPerson.partner).toBeNull();
      expect((createdPerson as any).spouse).not.toBeDefined();
      expect(createdPerson.entryDate).toBe('2015-02-02');
      expect(createdPerson.entryType).toBe('IRREGULAR');
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
      expect(createdPerson.passportStatus).toBe('PASSPORT');
      expect(createdPerson.passportNumber).toBe('P1');
      expect(createdPerson.passportValidityStartDate).toBe('2019-09-01');
      expect(createdPerson.passportValidityEndDate).toBe('2024-09-01');
      expect(createdPerson.visa).toBe('UNKNOWN');
      expect(createdPerson.residencePermit).toBe('UNKNOWN');
      expect(createdPerson.residencePermitDepositDate).toBe(null);
      expect(createdPerson.residencePermitRenewalDate).toBe(null);
      expect(createdPerson.residencePermitValidityStartDate).toBe('2019-03-02');
      expect(createdPerson.residencePermitValidityEndDate).toBe('2029-03-02');

      expect(router.navigate).toHaveBeenCalledWith(['persons', 43]);
    }));

    it('should accept only 13 digits for the fiscal number', () => {
      expect(FISCAL_NUMBER_PATTERN.test('1abcdefghijk2')).toBeFalsy();
      expect(FISCAL_NUMBER_PATTERN.test('123456789012')).toBeFalsy();
      expect(FISCAL_NUMBER_PATTERN.test('12345678901234')).toBeFalsy();
      expect(FISCAL_NUMBER_PATTERN.test('1234567890123')).toBeTruthy();
    });

    it('should warn about duplicate person creation', () => {
      const tester = new PersonEditTester();
      tester.detectChanges();

      expect(tester.similarPersonWarning).toBeNull();

      tester.firstName.fillWith('JANE');
      expect(tester.similarPersonWarning).toBeNull();

      tester.lastName.fillWith('DOE');
      expect(tester.similarPersonWarning).not.toBeNull();

      tester.lastName.fillWith('jane');
      expect(tester.similarPersonWarning).toBeNull();

      tester.lastName.fillWith('doe');
      expect(tester.similarPersonWarning).not.toBeNull();
    });
  });
});
