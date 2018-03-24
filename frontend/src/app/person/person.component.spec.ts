import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonComponent } from './person.component';
import { CityModel, PersonModel } from '../models/person.model';
import { DisplayGenderPipe } from '../display-gender.pipe';
import { DisplayMaritalStatusPipe } from '../display-marital-status.pipe';
import { DisplayCityPipe } from '../display-city.pipe';
import { DisplayFiscalStatusPipe } from '../display-fiscal-status.pipe';
import { DisplayHealthCareCoveragePipe } from '../display-health-care-coverage.pipe';
import { DisplayHealthInsurancePipe } from '../display-health-insurance.pipe';
import { DisplayHousingPipe } from '../display-housing.pipe';
import { LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmService } from '../confirm.service';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../person.service';
import { FullnamePipe } from '../fullname.pipe';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { of, throwError } from 'rxjs';

describe('PersonComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };
  const person: PersonModel = {
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
    frenchFamilySituation: null,
    abroadFamilySituation: null,
    deleted: false
  };

  const activatedRoute: any = {
    parent: {
      data: of({ person })
    }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule, HttpClientModule, GlobeNgbModule.forRoot(), FormsModule ],
    declarations: [
      PersonComponent,
      DisplayGenderPipe,
      DisplayMaritalStatusPipe,
      DisplayCityPipe,
      DisplayFiscalStatusPipe,
      DisplayHousingPipe,
      DisplayHealthCareCoveragePipe,
      DisplayHealthInsurancePipe,
      FullnamePipe
    ],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: LOCALE_ID, useValue: 'fr-FR'}
    ],
    schemas: [NO_ERRORS_SCHEMA]
  })));

  it('should have a maps URL', () => {
    const component = new PersonComponent(activatedRoute, null, null, null);
    component.ngOnInit();
    expect(component.mapsUrl).toBe('https://www.google.fr/maps/place/Chemin%20de%20la%20gare%2042000%20SAINT-ETIENNE');
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
    const mediationCode = nativeElement.querySelector('#mediationCode');
    expect(mediationCode.textContent).toBe('D1');
    const firstMediationAppointmentDate = nativeElement.querySelector('#firstMediationAppointmentDate');
    expect(firstMediationAppointmentDate.textContent).toBe('1 déc. 2017');
    const maritalStatus = nativeElement.querySelector('#maritalStatus');
    expect(maritalStatus.textContent).toBe('Marié(e)');
    const spouse = nativeElement.querySelector('#spouse');
    expect(spouse.textContent).toContain('Jane Doe');
    const housing = nativeElement.querySelector('#housing');
    expect(housing.textContent).toContain('F6 ou plus');
    expect(housing.textContent).toContain('80 m2');
    const fiscalStatus = nativeElement.querySelector('#fiscalStatus');
    expect(fiscalStatus.textContent).toContain('Imposable');
    expect(fiscalStatus.textContent).toContain('n° fiscal 0123456789012');
    expect(fiscalStatus.textContent).toContain('à jour');
    const healthCareCoverage = nativeElement.querySelector('#healthCareCoverage');
    expect(healthCareCoverage.textContent).toContain('Aide médicale de l\'Etat');
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
  });

  it('should display a person with mediation disabled', () => {
    person.mediationEnabled = false;
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const mediationDependantElementIds = [
      'entryDate',
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
      'nationality'
    ];
    mediationDependantElementIds.forEach(id =>
      expect(nativeElement.querySelector(`#${id}`)).toBeFalsy(`#${id} should be absent`));
  });

  it('should delete a person if confirmed', () => {
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const personService = TestBed.get(PersonService);
    const router = TestBed.get(Router);

    spyOn(confirmService, 'confirm').and.returnValue(of('ok'));
    spyOn(personService, 'delete').and.returnValue(of(null));
    spyOn(router, 'navigate');

    expect(fixture.nativeElement.querySelector('#resurrect-person-button')).toBeFalsy();
    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('#delete-person-button');
    deleteButton.click();

    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/persons']);
    expect(personService.delete).toHaveBeenCalledWith(person.id);
  });

  it('should not delete a person if not confirmed', () => {
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const personService = TestBed.get(PersonService);
    const router = TestBed.get(Router);

    spyOn(confirmService, 'confirm').and.returnValue(throwError('nok'));
    spyOn(personService, 'delete').and.returnValue(of(null));
    spyOn(router, 'navigate');

    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('#delete-person-button');
    deleteButton.click();

    fixture.detectChanges();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(personService.delete).not.toHaveBeenCalled();
  });

  it('should resurrect a person if confirmed', () => {
    person.deleted = true;
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const personService = TestBed.get(PersonService);
    const router = TestBed.get(Router);

    spyOn(confirmService, 'confirm').and.returnValue(of('ok'));
    spyOn(personService, 'resurrect').and.returnValue(of(null));
    spyOn(router, 'navigate');

    expect(fixture.nativeElement.querySelector('#delete-person-button')).toBeFalsy();
    const resurrectButton: HTMLButtonElement = fixture.nativeElement.querySelector('#resurrect-person-button');
    resurrectButton.click();

    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/persons']);
    expect(personService.resurrect).toHaveBeenCalledWith(person.id);
  });

  it('should not resurrect a person if not confirmed', () => {
    person.deleted = true;
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const personService = TestBed.get(PersonService);
    const router = TestBed.get(Router);

    spyOn(confirmService, 'confirm').and.returnValue(throwError('nok'));
    spyOn(personService, 'resurrect').and.returnValue(of(null));
    spyOn(router, 'navigate');

    const resurrectButton: HTMLButtonElement = fixture.nativeElement.querySelector('#resurrect-person-button');
    resurrectButton.click();

    fixture.detectChanges();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(personService.resurrect).not.toHaveBeenCalled();
  });
});
