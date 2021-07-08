import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { PersonComponent } from './person.component';
import { CityModel, PersonModel } from '../models/person.model';
import { DisplayGenderPipe } from '../display-gender.pipe';
import { DisplayMaritalStatusPipe } from '../display-marital-status.pipe';
import { DisplayCityPipe } from '../display-city.pipe';
import { DisplayFiscalStatusPipe } from '../display-fiscal-status.pipe';
import { DisplayHealthCareCoveragePipe } from '../display-health-care-coverage.pipe';
import { DisplayHealthInsurancePipe } from '../display-health-insurance.pipe';
import { DisplayHousingPipe } from '../display-housing.pipe';
import { DisplayResidencePermitPipe } from '../display-residence-permit.pipe';
import { DisplayVisaPipe } from '../display-visa.pipe';
import { LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmService } from '../confirm.service';
import { PersonService } from '../person.service';
import { FullnamePipe } from '../fullname.pipe';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { EMPTY, of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { DisplayEntryTypePipe } from '../display-entry-type.pipe';
import { CurrentPersonService } from '../current-person.service';
import { DisplayPassportStatusPipe } from '../display-passport-status.pipe';
import { ComponentTester } from 'ngx-speculoos';
import { DisplaySchoolLevelPipe } from '../display-school-level.pipe';

class PersonComponentTester extends ComponentTester<PersonComponent> {
  constructor() {
    super(PersonComponent);
  }

  get gender() {
    return this.element('#gender');
  }
  get address() {
    return this.element('#fullAddress');
  }
  get birthDate() {
    return this.element('#birthDate');
  }
  get email() {
    return this.element('#email');
  }
  get phoneNumber() {
    return this.element('#phoneNumber');
  }
  get entryDate() {
    return this.element('#entryDate');
  }
  get entryType() {
    return this.element('#entryType');
  }
  get mediationCode() {
    return this.element('#mediationCode');
  }
  get firstMediationAppointmentDate() {
    return this.element('#firstMediationAppointmentDate');
  }
  get maritalStatus() {
    return this.element('#maritalStatus');
  }
  get spouse() {
    return this.element('#spouse');
  }
  get partner() {
    return this.element('#partner');
  }
  get housing() {
    return this.element('#housing');
  }
  get fiscalStatus() {
    return this.element('#fiscalStatus');
  }
  get healthCareCoverage() {
    return this.element('#healthCareCoverage');
  }
  get healthInsurance() {
    return this.element('#healthInsurance');
  }
  get lastHealthCheckDate() {
    return this.element('#lastHealthCheckDate');
  }
  get accompanying() {
    return this.element('#accompanying');
  }
  get socialSecurityNumber() {
    return this.element('#socialSecurityNumber');
  }
  get cafNumber() {
    return this.element('#cafNumber');
  }
  get nationality() {
    return this.element('#nationality');
  }
  get passportStatus() {
    return this.element('#passportStatus');
  }
  get passportNumber() {
    return this.element('#passportNumber');
  }
  get passportValidityStartDate() {
    return this.element('#passportValidityStartDate');
  }
  get passportValidityEndDate() {
    return this.element('#passportValidityEndDate');
  }
  get visa() {
    return this.element('#visa');
  }
  get residencePermit() {
    return this.element('#residencePermit');
  }
  get residencePermitDepositDate() {
    return this.element('#residencePermitDepositDate');
  }
  get residencePermitRenewalDate() {
    return this.element('#residencePermitRenewalDate');
  }
  get residencePermitValidityStartDate() {
    return this.element('#residencePermitValidityStartDate');
  }
  get residencePermitValidityEndDate() {
    return this.element('#residencePermitValidityEndDate');
  }
  get schoolLevel() {
    return this.element('#schoolLevel');
  }

  get resurrectButton() {
    return this.button('#resurrect-person-button');
  }
  get deleteButton() {
    return this.button('#delete-person-button');
  }
}

describe('PersonComponent', () => {
  let person: PersonModel;
  let currentPersonService: CurrentPersonService;
  let tester: PersonComponentTester;

  beforeEach(() => {
    const cityModel: CityModel = {
      code: 42000,
      city: 'SAINT-ETIENNE'
    };
    person = {
      id: 0,
      firstName: 'John',
      lastName: 'Doe',
      birthName: 'Abba',
      nickName: 'john',
      mediationCode: 'D1',
      birthDate: '1980-01-01',
      address: 'Chemin de la gare',
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
        mediationCode: 'D2',
        email: null,
        phoneNumber: null
      },
      partner: null,
      housing: 'F6',
      housingSpace: 80,
      hostName: 'Bruno Mala',
      fiscalStatus: 'TAXABLE',
      fiscalNumber: '0123456789012',
      fiscalStatusUpToDate: true,
      healthCareCoverage: 'AME',
      healthCareCoverageStartDate: '2017-01-01',
      healthInsurance: 'CMUC',
      healthInsuranceStartDate: '2017-02-02',
      lastHealthCheckDate: '2019-12-05',
      accompanying: 'Paul',
      socialSecurityNumber: '277126912340454',
      cafNumber: '123765',
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
      schoolLevel: 'MIDDLE',
      deathDate: null,
      deleted: false
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, GlobeNgbTestingModule],
      declarations: [
        PersonComponent,
        DisplayGenderPipe,
        DisplayMaritalStatusPipe,
        DisplayCityPipe,
        DisplayFiscalStatusPipe,
        DisplayHousingPipe,
        DisplayHealthCareCoveragePipe,
        DisplayHealthInsurancePipe,
        DisplayResidencePermitPipe,
        DisplayVisaPipe,
        DisplayEntryTypePipe,
        DisplayPassportStatusPipe,
        DisplaySchoolLevelPipe,
        FullnamePipe,
        PageTitleDirective
      ],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'personChanges$').and.returnValue(of(person));

    tester = new PersonComponentTester();
    tester.detectChanges();
  });

  it('should have a maps URL', () => {
    expect(tester.componentInstance.mapsUrl).toBe(
      'https://www.google.fr/maps/place/Chemin%20de%20la%20gare%2042000%20SAINT-ETIENNE'
    );
  });

  it('should display a person', () => {
    expect(tester.gender).toHaveText('Homme');
    expect(tester.address).toContainText('Chemin de la gare');
    expect(tester.address).toContainText('42000 SAINT-ETIENNE');
    expect(tester.birthDate).toHaveText('1 janv. 1980');
    expect(tester.email).toContainText('john@mail.com');
    expect(tester.phoneNumber).toContainText('06 12 34 56 78');
    expect(tester.entryDate).toHaveText('1 déc. 2016');
    expect(tester.entryType).toContainText('Régulière');
    expect(tester.mediationCode).toHaveText('D1');
    expect(tester.firstMediationAppointmentDate).toContainText('1 déc. 2017');
    expect(tester.maritalStatus).toContainText('Marié(e)');
    expect(tester.spouse).toContainText('Jane Doe');
    expect(tester.partner).toBeFalsy();
    expect(tester.housing).toContainText('F6 ou plus');
    expect(tester.housing).toContainText('80 m2');
    expect(tester.fiscalStatus).toContainText('Imposable');
    expect(tester.fiscalStatus).toContainText('n° fiscal 0123456789012');
    expect(tester.fiscalStatus).toContainText('à jour');
    expect(tester.healthCareCoverage).toContainText("Aide médicale de l'Etat");
    expect(tester.healthCareCoverage).toContainText('depuis le 1 janv. 2017');
    expect(tester.healthInsurance).toContainText('CMU-C');
    expect(tester.healthInsurance).toContainText('depuis le 2 févr. 2017');
    expect(tester.lastHealthCheckDate).toContainText('5 déc. 2019');
    expect(tester.accompanying).toContainText('Paul');
    expect(tester.socialSecurityNumber).toContainText('277126912340454');
    expect(tester.cafNumber).toContainText('123765');
    expect(tester.nationality).toContainText('France');
    expect(tester.passportStatus).toContainText('Oui');
    expect(tester.passportNumber).toContainText('P1');
    expect(tester.passportValidityStartDate).toContainText('1 sept. 2019');
    expect(tester.passportValidityEndDate).toContainText('1 sept. 2024');
    expect(tester.visa).toHaveText('D (long séjour)');
    expect(tester.residencePermit).toContainText('Carte de résident de 10 ans');
    expect(tester.residencePermitDepositDate).toContainText('2 févr. 2018');
    expect(tester.residencePermitRenewalDate).toContainText('2 oct. 2018');
    expect(tester.residencePermitValidityStartDate).toContainText('2 mars 2019');
    expect(tester.residencePermitValidityEndDate).toContainText('2 mars 2029');
    expect(tester.schoolLevel).toContainText('Collège');
  });

  it('should display a person with no spouse but a partner', () => {
    person.spouse = null;
    person.partner = 'old friend';
    tester.detectChanges();

    expect(tester.partner).toHaveText('old friend');
  });

  it('should display a person with mediation disabled', () => {
    person.mediationEnabled = false;
    tester.detectChanges();

    const mediationDependantElementIds = [
      'entryDate',
      'entryType',
      'mediationCode',
      'housing',
      'fiscalStatus',
      'firstMediationAppointmentDate',
      'maritalStatus',
      'spouse',
      'healthCareCoverage',
      'healthInsurance',
      'lastHealthCheckDate',
      'accompanying',
      'socialSecurityNumber',
      'cafNumber',
      'nationality',
      'visa',
      'residencePermit',
      'residencePermitDepositDate',
      'residencePermitRenewalDate',
      'schoolLevel'
    ];
    mediationDependantElementIds.forEach(id =>
      expect(tester.element(`#${id}`)).toBeFalsy(`#${id} should be absent`)
    );
  });

  it('should delete a person if confirmed', () => {
    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(personService, 'delete').and.returnValue(of(null));
    spyOn(router, 'navigate');

    expect(tester.resurrectButton).toBeFalsy();
    tester.deleteButton.click();

    tester.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/persons']);
    expect(personService.delete).toHaveBeenCalledWith(person.id);
  });

  it('should not delete a person if not confirmed', () => {
    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);
    spyOn(personService, 'delete').and.returnValue(of(null));
    spyOn(router, 'navigate');

    tester.deleteButton.click();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(personService.delete).not.toHaveBeenCalled();
  });

  it('should resurrect a person if confirmed', () => {
    person.deleted = true;
    tester.detectChanges();

    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(personService, 'resurrect').and.returnValue(of(null));
    spyOn(router, 'navigate');

    expect(tester.deleteButton).toBeFalsy();
    tester.resurrectButton.click();

    expect(router.navigate).toHaveBeenCalledWith(['/persons']);
    expect(personService.resurrect).toHaveBeenCalledWith(person.id);
  });

  it('should not resurrect a person if not confirmed', () => {
    person.deleted = true;
    tester.detectChanges();

    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);
    spyOn(personService, 'resurrect').and.returnValue(of(null));
    spyOn(router, 'navigate');

    tester.resurrectButton.click();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(personService.resurrect).not.toHaveBeenCalled();
  });
});
