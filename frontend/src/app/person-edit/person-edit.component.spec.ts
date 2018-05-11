import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FISCAL_NUMBER_PATTERN, PersonEditComponent } from './person-edit.component';
import { PersonService } from '../person.service';
import { CityModel, PersonIdentityModel, PersonModel } from '../models/person.model';
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
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, GlobeNgbModule.forRoot()],
    declarations: [
      PersonEditComponent,
      DisplayMaritalStatusPipe,
      DisplayCityPipe,
      DisplayGenderPipe,
      DisplayHousingPipe,
      DisplayFiscalStatusPipe,
      DisplayHealthCareCoveragePipe,
      DisplayHealthInsurancePipe,
      FullnamePipe
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
      deleted: false
    };

    const activatedRoute = {
      snapshot: {data: {person, persons, countries}}
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{provide: ActivatedRoute, useValue: activatedRoute}]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification de l\'adhérent John Doe (john)');
    });

    it('should edit and update an existing person', () => {
      const personService = TestBed.get(PersonService);
      spyOn(personService, 'update').and.returnValue(of(person));
      const router = TestBed.get(Router);
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const firstName = nativeElement.querySelector('#firstName');
      expect(firstName.value).toBe(person.firstName);
      const lastName = nativeElement.querySelector('#lastName');
      expect(lastName.value).toBe(person.lastName);
      const birthName = nativeElement.querySelector('#birthName');
      expect(birthName.value).toBe(person.birthName);
      const nickName = nativeElement.querySelector('#nickName');
      expect(nickName.value).toBe(person.nickName);
      const gender = nativeElement.querySelector('#genderMALE');
      expect(gender.checked).toBe(true);
      const birthDate = nativeElement.querySelector('#birthDate');
      expect(birthDate.value).toBe('01/01/1980');
      const mediationCode = nativeElement.querySelector('#mediationCode');
      expect(mediationCode.textContent).toContain('Généré automatiquement');
      const address = nativeElement.querySelector('#address');
      expect(address.value).toBe(person.address);
      const city = nativeElement.querySelector('#city');
      expect(city.value).toBe(displayCity(person.city));
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe(person.email);
      const phoneNumber = nativeElement.querySelector('#phoneNumber');
      expect(phoneNumber.value).toBe(person.phoneNumber);
      const firstMediationAppointmentDate = nativeElement.querySelector('#firstMediationAppointmentDate');
      expect(firstMediationAppointmentDate.value).toBe('01/12/2017');
      const maritalStatus: HTMLSelectElement = nativeElement.querySelector('#maritalStatus');
      expect(maritalStatus.options[maritalStatus.selectedIndex].value).toBe(person.maritalStatus);
      const spouse: HTMLInputElement = nativeElement.querySelector('#spouse');
      expect(spouse.value).toBe('Jane Doe');
      const entryDate = nativeElement.querySelector('#entryDate');
      expect(entryDate.value).toBe('01/12/2016');
      const housing: HTMLSelectElement = nativeElement.querySelector('#housing');
      expect(housing.options[housing.selectedIndex].value).toBe(person.housing);
      const housingSpace = nativeElement.querySelector('#housingSpace');
      expect(+housingSpace.value).toBe(person.housingSpace);
      const hostName = nativeElement.querySelector('#hostName');
      expect(hostName.value).toBe(person.hostName);
      const fiscalStatusUnknown = nativeElement.querySelector('#fiscalStatusUNKNOWN');
      expect(fiscalStatusUnknown.checked).toBe(false);
      const fiscalStatusNotTaxable = nativeElement.querySelector('#fiscalStatusNOT_TAXABLE');
      expect(fiscalStatusNotTaxable.checked).toBe(false);
      const fiscalStatusTaxable = nativeElement.querySelector('#fiscalStatusTAXABLE');
      expect(fiscalStatusTaxable.checked).toBe(true);
      const fiscalNumber = nativeElement.querySelector('#fiscalNumber');
      expect(fiscalNumber.value).toBe('0123456789012');
      const fiscalStatusUpToDate = nativeElement.querySelector('#fiscalStatusUpToDate');
      expect(fiscalStatusUpToDate.checked).toBe(person.fiscalStatusUpToDate);
      const healthCareCoverage: HTMLSelectElement = nativeElement.querySelector('#healthCareCoverage');
      expect(healthCareCoverage.options[healthCareCoverage.selectedIndex].value).toBe(person.healthCareCoverage);
      const healthCareCoverageStartDate = nativeElement.querySelector('#healthCareCoverageStartDate');
      expect(healthCareCoverageStartDate.value).toBe('01/01/2017');
      const healthInsurance: HTMLSelectElement = nativeElement.querySelector('#healthInsurance');
      expect(healthInsurance.options[healthInsurance.selectedIndex].value).toBe(person.healthInsurance);
      const healthInsuranceStartDate = nativeElement.querySelector('#healthInsuranceStartDate');
      expect(healthInsuranceStartDate.value).toBe('02/02/2017');
      const accompanying = nativeElement.querySelector('#accompanying');
      expect(accompanying.value).toBe(person.accompanying);
      const socialSecurityNumber = nativeElement.querySelector('#socialSecurityNumber');
      expect(socialSecurityNumber.value).toBe(person.socialSecurityNumber);
      const cafNumber = nativeElement.querySelector('#cafNumber');
      expect(cafNumber.value).toBe(person.cafNumber);
      const nationality = nativeElement.querySelector('#nationality');
      expect(nationality.value).toBe(person.nationality.name);

      lastName.value = 'Do';
      lastName.dispatchEvent(new Event('input'));
      nativeElement.querySelector('#save').click();

      expect(personService.update).toHaveBeenCalled();

      const idUpdated = personService.update.calls.argsFor(0)[0];
      expect(idUpdated).toBe(42);
      const personUpdated = personService.update.calls.argsFor(0)[1];
      expect(personUpdated.lastName).toBe('Do');
      expect(personUpdated.firstName).toBe('John');

      expect(router.navigate).toHaveBeenCalledWith(['persons', 42]);
    });

    it('should clear the city input on blur if not valid anymore', () =>  {
      const fixture = TestBed.createComponent(PersonEditComponent);
      // fake typeahead results
      fixture.componentInstance.cityTypeahead.searcher = (text: Observable<string>) => text.pipe(map(() => []));

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const city: HTMLInputElement = nativeElement.querySelector('#city');
      expect(city.value).toBe(displayCity(person.city));

      // erase something in the field, which should make its model null
      city.value = '42000 SAINT-ETIENN';
      city.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(fixture.componentInstance.personForm.value.city).toBeFalsy();
      expect(city.classList).toContain('is-warning');

      // move out of the field, which should clear it
      city.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(city.value).toBeFalsy();
    });

    it('should clear the spouse input on blur if not valid anymore', () =>  {
      const fixture = TestBed.createComponent(PersonEditComponent);
      // fake typeahead results
      fixture.componentInstance.spouseTypeahead.searcher = (text: Observable<string>) => text.pipe(map(() => []));

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const spouse: HTMLInputElement = nativeElement.querySelector('#spouse');
      expect(spouse.value).toBe('Jane Doe');

      // erase something in the field, which should make its model null
      spouse.value = 'Jane';
      spouse.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(fixture.componentInstance.personForm.value.spouse).toBeFalsy();
      expect(spouse.classList).toContain('is-warning');

      // move out of the field, which should clear it
      spouse.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(spouse.value).toBeFalsy();
    });

    it('should warn if selecting a spouse already in couple with someone else', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement;
      const component = fixture.componentInstance;

      const personService = TestBed.get(PersonService);
      spyOn(personService, 'get').and.returnValue(of({ spouse: { id: 54 } }));

      component.personForm.get('spouse').setValue({ id: 17, firstName: 'Jackie', lastName: 'Doe' });
      fixture.detectChanges();

      expect(component.spouseIsInCouple).toBe(true);
      expect(nativeElement.textContent).toContain(`Jackie Doe est déjà en couple avec quelqu'un d'autre`);
    });

    it('should not warn if selecting a spouse not already in couple with someone else', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement;
      const component = fixture.componentInstance;

      const personService = TestBed.get(PersonService);
      spyOn(personService, 'get').and.returnValue(of({ spouse: null }));

      component.personForm.get('spouse').setValue({ id: 17, firstName: 'Jackie', lastName: 'Doe' });
      fixture.detectChanges();

      expect(component.spouseIsInCouple).toBe(false);
      expect(nativeElement.textContent).not.toContain(`Jackie Doe est déjà en couple avec quelqu'un d'autre`);
    });

    it('should not warn if selecting the current spouse of the edited person', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement;
      const component = fixture.componentInstance;

      const personService = TestBed.get(PersonService);
      spyOn(personService, 'get').and.returnValue(of({ spouse: { id: 42 } }));

      component.personForm.get('spouse').setValue({ id: 43, firstName: 'Jane', lastName: 'Doe' });
      fixture.detectChanges();

      expect(component.spouseIsInCouple).toBe(false);
      expect(nativeElement.textContent).not.toContain(`Jane Doe est déjà en couple avec quelqu'un d'autre`);
    });

    it('should set the fiscal number to null if invalid when setting the fiscal status to UNKNONW', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement;
      const component = fixture.componentInstance;

      const fiscalNumber = nativeElement.querySelector('#fiscalNumber');
      fiscalNumber.value = 'INVALID';
      fiscalNumber.dispatchEvent(new Event('input'));

      const fiscalStatusUnknown = nativeElement.querySelector('#fiscalStatusUNKNOWN');
      fiscalStatusUnknown.click();

      fixture.detectChanges();

      expect(fiscalNumber.value).toBe('');
      expect(component.personForm.get('fiscalNumber').value).toBeNull();

      fixture.detectChanges();
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

    it('should have a title', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvel adhérent');
    });


    it('should create and save a new person', fakeAsync(() => {
      const personService = TestBed.get(PersonService);
      spyOn(personService, 'create').and.returnValue(of({id: 43} as PersonModel));
      const router = TestBed.get(Router);
      spyOn(router, 'navigate');
      const fixture = TestBed.createComponent(PersonEditComponent);
      // fake typeahead results
      fixture.componentInstance.cityTypeahead.searcher = (text: Observable<string>) => of([cityModel]);

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const firstName = nativeElement.querySelector('#firstName');
      expect(firstName.value).toBe('');
      const lastName = nativeElement.querySelector('#lastName');
      expect(lastName.value).toBe('');
      const birthName = nativeElement.querySelector('#birthName');
      expect(birthName.value).toBe('');
      const nickName = nativeElement.querySelector('#nickName');
      expect(nickName.value).toBe('');
      const genderMale = nativeElement.querySelector('#genderMALE');
      expect(genderMale.checked).toBe(false);
      const genderFemale = nativeElement.querySelector('#genderFEMALE');
      expect(genderFemale.checked).toBe(false);
      const genderOther = nativeElement.querySelector('#genderOTHER');
      expect(genderOther.checked).toBe(false);
      const birthDate = nativeElement.querySelector('#birthDate');
      expect(birthDate.value).toBe('');
      const address = nativeElement.querySelector('#address');
      expect(address.value).toBe('');
      const city = nativeElement.querySelector('#city');
      expect(city.value).toBe('');
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe('');
      const phoneNumber = nativeElement.querySelector('#phoneNumber');
      expect(phoneNumber.value).toBe('');

      const mediationEnabledYes = nativeElement.querySelector('#mediationEnabledtrue');
      expect(mediationEnabledYes.checked).toBe(false);
      const mediationEnabledNo = nativeElement.querySelector('#mediationEnabledfalse');
      expect(mediationEnabledNo.checked).toBe(true);

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
        expect(nativeElement.querySelector(`#${id}`)).toBeFalsy(`#${id} should be absent`);
      });

      mediationEnabledYes.checked = true;
      mediationEnabledYes.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      tick();

      mediationDependantIds.forEach(id => {
        expect(nativeElement.querySelector(`#${id}`)).toBeTruthy(`#${id} should be present`);
      });

      const mediationCode = nativeElement.querySelector('#mediationCode');
      expect(mediationCode.textContent).toContain('Généré automatiquement');
      const firstMediationAppointmentDate = nativeElement.querySelector('#firstMediationAppointmentDate');
      expect(firstMediationAppointmentDate.value).toBe('');
      const maritalStatus: HTMLSelectElement = nativeElement.querySelector('#maritalStatus');
      expect(maritalStatus.selectedIndex).toBe(0);
      const spouse: HTMLInputElement = nativeElement.querySelector('#spouse');
      expect(spouse.value).toBe('');
      expect(maritalStatus.options[0].value).toBe('UNKNOWN');
      const entryDate = nativeElement.querySelector('#entryDate');
      expect(entryDate.value).toBe('');
      const housing: HTMLSelectElement = nativeElement.querySelector('#housing');
      expect(housing.options[housing.selectedIndex].value).toBe('UNKNOWN');
      let housingSpace = nativeElement.querySelector('#housingSpace');
      expect(housingSpace).toBeFalsy();
      const hostName = nativeElement.querySelector('#hostName');
      expect(hostName.value).toBe('');
      const fiscalStatusUnknown = nativeElement.querySelector('#fiscalStatusUNKNOWN');
      expect(fiscalStatusUnknown.checked).toBe(true);
      let fiscalNumber = nativeElement.querySelector('#fiscalNumber');
      expect(fiscalNumber).toBeFalsy();
      let fiscalStatusUpToDate = nativeElement.querySelector('#fiscalStatusUpToDate');
      expect(fiscalStatusUpToDate).toBeFalsy();
      const accompanying = nativeElement.querySelector('#accompanying');
      expect(accompanying.value).toBe('');
      const socialSecurityNumber = nativeElement.querySelector('#socialSecurityNumber');
      expect(socialSecurityNumber.value).toBe('');
      const cafNumber = nativeElement.querySelector('#cafNumber');
      expect(cafNumber.value).toBe('');
      const healthCareCoverage: HTMLSelectElement = nativeElement.querySelector('#healthCareCoverage');
      expect(healthCareCoverage.options[healthCareCoverage.selectedIndex].value).toBe('UNKNOWN');
      let healthCareCoverageStartDate = nativeElement.querySelector('#healthCareCoverageStartDate');
      expect(healthCareCoverageStartDate).toBeFalsy();
      const healthInsurance: HTMLSelectElement = nativeElement.querySelector('#healthInsurance');
      expect(healthInsurance.options[healthInsurance.selectedIndex].value).toBe('UNKNOWN');
      let healthInsuranceStartDate = nativeElement.querySelector('#healthInsuranceStartDate');
      expect(healthInsuranceStartDate).toBeFalsy();
      const nationality = nativeElement.querySelector('#nationality');
      expect(nationality.value).toBe('');

      lastName.value = 'Doe';
      lastName.dispatchEvent(new Event('input'));
      firstName.value = 'Jane';
      firstName.dispatchEvent(new Event('input'));
      birthName.value = 'Jos';
      birthName.dispatchEvent(new Event('input'));
      nickName.value = 'jane';
      nickName.dispatchEvent(new Event('input'));
      genderFemale.checked = true;
      genderFemale.dispatchEvent(new Event('change'));
      birthDate.value = '03/03/1985';
      birthDate.dispatchEvent(new Event('change'));
      address.value = 'Avenue Liberté';
      address.dispatchEvent(new Event('input'));

      // trigger city typeahead
      city.value = '4200';
      city.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();
      // select first result
      const cityResult = nativeElement.querySelector('ngb-typeahead-window button');
      expect(cityResult.textContent).toContain(displayCity(cityModel));
      cityResult.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick();

      email.value = 'jane@mail.com';
      email.dispatchEvent(new Event('input'));
      phoneNumber.value = '06 13 13 13 13';
      phoneNumber.dispatchEvent(new Event('input'));
      maritalStatus.selectedIndex = 2;
      maritalStatus.dispatchEvent(new Event('change'));

      // trigger spouse typeahead
      spyOn(personService, 'get').and.returnValue(of({ spouse: null }));
      spouse.value = 'Jane';
      spouse.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(500);
      // select first result
      const spouseResult = nativeElement.querySelector('ngb-typeahead-window button');
      expect(spouseResult.textContent).toContain('Jane Doe');
      spouseResult.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick();

      entryDate.value = '02/02/2015';
      entryDate.dispatchEvent(new Event('change'));
      firstMediationAppointmentDate.value = '02/02/2017';
      firstMediationAppointmentDate.dispatchEvent(new Event('change'));
      housing.selectedIndex = 1;
      housing.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      housingSpace = nativeElement.querySelector('#housingSpace');
      expect(housingSpace).toBeTruthy();
      housingSpace.value = '30';
      housingSpace.dispatchEvent(new Event('input'));
      hostName.value = 'Bruno';
      hostName.dispatchEvent(new Event('change'));
      accompanying.value = 'Paulette';
      accompanying.dispatchEvent(new Event('input'));
      socialSecurityNumber.value = '453287654309876';
      socialSecurityNumber.dispatchEvent(new Event('input'));
      cafNumber.value = '78654';
      cafNumber.dispatchEvent(new Event('input'));
      const fiscalStatusTaxable = nativeElement.querySelector('#fiscalStatusTAXABLE');
      fiscalStatusTaxable.checked = true;
      fiscalStatusTaxable.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      tick();

      fiscalNumber = nativeElement.querySelector('#fiscalNumber');
      expect(fiscalNumber).toBeTruthy();
      fiscalNumber.value = '0123456789012';
      fiscalNumber.dispatchEvent(new Event('input'));

      fiscalStatusUpToDate = nativeElement.querySelector('#fiscalStatusUpToDate');
      expect(fiscalStatusUpToDate).toBeTruthy();
      fiscalStatusUpToDate.checked = true;
      fiscalStatusUpToDate.dispatchEvent(new Event('change'));

      healthCareCoverage.selectedIndex = 1;
      healthCareCoverage.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      tick();
      healthCareCoverageStartDate = nativeElement.querySelector('#healthCareCoverageStartDate');
      expect(healthCareCoverageStartDate).toBeTruthy();
      healthCareCoverageStartDate.value = '01/01/2017';
      healthCareCoverageStartDate.dispatchEvent(new Event('change'));

      healthInsurance.selectedIndex = 1;
      healthInsurance.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      tick();
      healthInsuranceStartDate = nativeElement.querySelector('#healthInsuranceStartDate');
      expect(healthInsuranceStartDate).toBeTruthy();
      healthInsuranceStartDate.value = '02/02/2017';
      healthInsuranceStartDate.dispatchEvent(new Event('change'));

      // trigger nationality typeahead
      nationality.value = 'Bel';
      nationality.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(500);
      // select first result
      const nationalityResult = nativeElement.querySelector('ngb-typeahead-window button');
      expect(nationalityResult.textContent).toContain('Belgique');
      nationalityResult.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick();

      nativeElement.querySelector('#save').click();
      fixture.detectChanges();
      tick();

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
      expect(createdPerson.hostName).toBe('');
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
