import { async, TestBed } from '@angular/core/testing';
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
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { EMPTY, of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { DisplayEntryTypePipe } from '../display-entry-type.pipe';
import { CurrentPersonService } from '../current-person.service';
import { DisplayPassportStatusPipe } from '../display-passport-status.pipe';

describe('PersonComponent', () => {
  let person: PersonModel;
  let currentPersonService: CurrentPersonService;

  beforeEach(async(() => {
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
        mediationCode: 'D2'
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
      deathDate: null,
      deleted: false
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, GlobeNgbModule.forRoot()],
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
        FullnamePipe,
        PageTitleDirective
      ],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'personChanges$').and.returnValue(of(person));
  }));

  it('should have a maps URL', () => {
    const component = new PersonComponent(null, null, currentPersonService, null);
    component.ngOnInit();
    expect(component.mapsUrl).toBe(
      'https://www.google.fr/maps/place/Chemin%20de%20la%20gare%2042000%20SAINT-ETIENNE'
    );
  });

  it('should display a person', () => {
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const gender = nativeElement.querySelector('#gender');
    expect(gender.textContent).toBe('Homme');
    const address = nativeElement.querySelector('#fullAddress');
    expect(address.textContent).toContain('Chemin de la gare');
    expect(address.textContent).toContain('42000 SAINT-ETIENNE');
    const birthDate = nativeElement.querySelector('#birthDate');
    expect(birthDate.textContent).toBe('1 janv. 1980');
    const email = nativeElement.querySelector('#email');
    expect(email.textContent).toContain('john@mail.com');
    const phoneNumber = nativeElement.querySelector('#phoneNumber');
    expect(phoneNumber.textContent).toContain('06 12 34 56 78');
    const entryDate = nativeElement.querySelector('#entryDate');
    expect(entryDate.textContent).toBe('1 déc. 2016');
    const entryType = nativeElement.querySelector('#entryType');
    expect(entryType.textContent).toContain('Régulière');
    const mediationCode = nativeElement.querySelector('#mediationCode');
    expect(mediationCode.textContent).toBe('D1');
    const firstMediationAppointmentDate = nativeElement.querySelector(
      '#firstMediationAppointmentDate'
    );
    expect(firstMediationAppointmentDate.textContent).toContain('1 déc. 2017');
    const maritalStatus = nativeElement.querySelector('#maritalStatus');
    expect(maritalStatus.textContent).toContain('Marié(e)');
    const spouse = nativeElement.querySelector('#spouse');
    expect(spouse.textContent).toContain('Jane Doe');
    const partner = nativeElement.querySelector('#partner');
    expect(partner).toBeFalsy();
    const housing = nativeElement.querySelector('#housing');
    expect(housing.textContent).toContain('F6 ou plus');
    expect(housing.textContent).toContain('80 m2');
    const fiscalStatus = nativeElement.querySelector('#fiscalStatus');
    expect(fiscalStatus.textContent).toContain('Imposable');
    expect(fiscalStatus.textContent).toContain('n° fiscal 0123456789012');
    expect(fiscalStatus.textContent).toContain('à jour');
    const healthCareCoverage = nativeElement.querySelector('#healthCareCoverage');
    expect(healthCareCoverage.textContent).toContain("Aide médicale de l'Etat");
    expect(healthCareCoverage.textContent).toContain('depuis le 1 janv. 2017');
    const healthInsurance = nativeElement.querySelector('#healthInsurance');
    expect(healthInsurance.textContent).toContain('CMU-C');
    expect(healthInsurance.textContent).toContain('depuis le 2 févr. 2017');
    const accompanying = nativeElement.querySelector('#accompanying');
    expect(accompanying.textContent).toContain('Paul');
    const socialSecurityNumber = nativeElement.querySelector('#socialSecurityNumber');
    expect(socialSecurityNumber.textContent).toContain('277126912340454');
    const cafNumber = nativeElement.querySelector('#cafNumber');
    expect(cafNumber.textContent).toContain('123765');
    const nationality = nativeElement.querySelector('#nationality');
    expect(nationality.textContent).toContain('France');
    const passportStatus = nativeElement.querySelector('#passportStatus');
    expect(passportStatus.textContent).toContain('Oui');
    const passportNumber = nativeElement.querySelector('#passportNumber');
    expect(passportNumber.textContent).toContain('P1');
    const passportValidityStartDate = nativeElement.querySelector('#passportValidityStartDate');
    expect(passportValidityStartDate.textContent).toContain('1 sept. 2019');
    const passportValidityEndDate = nativeElement.querySelector('#passportValidityEndDate');
    expect(passportValidityEndDate.textContent).toContain('1 sept. 2024');
    const visa = nativeElement.querySelector('#visa');
    expect(visa.textContent).toBe('D (long séjour)');
    const residencePermit = nativeElement.querySelector('#residencePermit');
    expect(residencePermit.textContent).toContain('Carte de résident de 10 ans');
    const residencePermitDepositDate = nativeElement.querySelector('#residencePermitDepositDate');
    expect(residencePermitDepositDate.textContent).toContain('2 févr. 2018');
    const residencePermitRenewalDate = nativeElement.querySelector('#residencePermitRenewalDate');
    expect(residencePermitRenewalDate.textContent).toContain('2 oct. 2018');
    const residencePermitValidityStartDate = nativeElement.querySelector(
      '#residencePermitValidityStartDate'
    );
    expect(residencePermitValidityStartDate.textContent).toContain('2 mars 2019');
    const residencePermitValidityEndDate = nativeElement.querySelector(
      '#residencePermitValidityEndDate'
    );
    expect(residencePermitValidityEndDate.textContent).toContain('2 mars 2029');
  });

  it('should display a person with no spouse but a partner', () => {
    person.spouse = null;
    person.partner = 'old friend';
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const partner = nativeElement.querySelector('#partner');
    expect(partner.textContent).toBe('old friend');
  });

  it('should display a person with mediation disabled', () => {
    person.mediationEnabled = false;
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
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
      'accompanying',
      'socialSecurityNumber',
      'cafNumber',
      'nationality',
      'visa',
      'residencePermit',
      'residencePermitDepositDate',
      'residencePermitRenewalDate'
    ];
    mediationDependantElementIds.forEach(id =>
      expect(nativeElement.querySelector(`#${id}`)).toBeFalsy(`#${id} should be absent`)
    );
  });

  it('should delete a person if confirmed', () => {
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(personService, 'delete').and.returnValue(of(null));
    spyOn(router, 'navigate');

    expect(fixture.nativeElement.querySelector('#resurrect-person-button')).toBeFalsy();
    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '#delete-person-button'
    );
    deleteButton.click();

    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/persons']);
    expect(personService.delete).toHaveBeenCalledWith(person.id);
  });

  it('should not delete a person if not confirmed', () => {
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);
    spyOn(personService, 'delete').and.returnValue(of(null));
    spyOn(router, 'navigate');

    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '#delete-person-button'
    );
    deleteButton.click();

    fixture.detectChanges();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(personService.delete).not.toHaveBeenCalled();
  });

  it('should resurrect a person if confirmed', () => {
    person.deleted = true;
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(personService, 'resurrect').and.returnValue(of(null));
    spyOn(router, 'navigate');

    expect(fixture.nativeElement.querySelector('#delete-person-button')).toBeFalsy();
    const resurrectButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '#resurrect-person-button'
    );
    resurrectButton.click();

    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/persons']);
    expect(personService.resurrect).toHaveBeenCalledWith(person.id);
  });

  it('should not resurrect a person if not confirmed', () => {
    person.deleted = true;
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.inject(ConfirmService);
    const personService = TestBed.inject(PersonService);
    const router = TestBed.inject(Router);

    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);
    spyOn(personService, 'resurrect').and.returnValue(of(null));
    spyOn(router, 'navigate');

    const resurrectButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '#resurrect-person-button'
    );
    resurrectButton.click();

    fixture.detectChanges();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(personService.resurrect).not.toHaveBeenCalled();
  });
});
