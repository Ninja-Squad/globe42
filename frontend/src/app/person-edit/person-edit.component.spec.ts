import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PersonEditComponent } from './person-edit.component';
import { PersonService } from '../person.service';
import { CityModel, PersonModel } from '../models/person.model';
import { DisplayCityPipe } from '../display-city.pipe';
import { DisplayMaritalStatusPipe, MARITAL_STATUS_TRANSLATIONS } from '../display-marital-status.pipe';
import { PersonCommand } from '../models/person.command';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisplayGenderPipe } from '../display-gender.pipe';
import { SearchCityService } from '../search-city.service';
import { DisplayHousingPipe } from '../display-housing.pipe';
import { DisplayFiscalStatusPipe } from '../display-fiscal-status.pipe';
import { DisplayHealthCareCoveragePipe, HEALTH_CARE_COVERAGE_TRANSLATIONS } from '../display-health-care-coverage.pipe';
import { FamilySituationEditComponent } from '../family-situation-edit/family-situation-edit.component';
import { By } from '@angular/platform-browser';
import { FrenchDateParserFormatterService } from '../french-date-parser-formatter.service';
import { FullnamePipe } from '../fullname.pipe';

describe('PersonEditComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, NgbModule.forRoot()],
    declarations: [
      PersonEditComponent,
      DisplayMaritalStatusPipe,
      DisplayCityPipe,
      DisplayGenderPipe,
      DisplayHousingPipe,
      DisplayFiscalStatusPipe,
      DisplayHealthCareCoveragePipe,
      FamilySituationEditComponent,
      FullnamePipe
    ],
    providers: [
      PersonService,
      DisplayCityPipe,
      SearchCityService,
      { provide: NgbDateParserFormatter, useClass: FrenchDateParserFormatterService }
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
      mediationCode: 'code1',
      address: 'Chemin de la gare',
      birthDate: '1980-01-01',
      city: cityModel,
      email: 'john@mail.com',
      adherent: true,
      entryDate: '2016-12-01',
      gender: 'MALE',
      phoneNumber: '06 12 34 56 78',
      mediationEnabled: true,
      firstMediationAppointmentDate: '2017-12-01',
      maritalStatus: 'SINGLE',
      housing: 'F4',
      housingSpace: 80,
      hostName: 'Bruno Mala',
      fiscalStatus: 'TAXABLE',
      fiscalStatusUpToDate: true,
      fiscalStatusDate: '2017-02-01',
      healthCareCoverage: 'AME',
      accompanying: 'Paul',
      socialSecurityNumber: '234765498056734',
      cafNumber: '56734',
      frenchFamilySituation: {
        parentsPresent: false,
        spousePresent: true,
        childCount: 1,
        siblingCount: 3
      },
      abroadFamilySituation: null,
      deleted: false
    };

    const activatedRoute = {
      snapshot: {data: {person}}
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
      spyOn(personService, 'update').and.returnValue(Observable.of(person));
      const router = TestBed.get(Router);
      spyOn(router, 'navigate');
      const displayCityPipe = TestBed.get(DisplayCityPipe);
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
      expect(city.value).toBe(displayCityPipe.transform(person.city));
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe(person.email);
      const phoneNumber = nativeElement.querySelector('#phoneNumber');
      expect(phoneNumber.value).toBe(person.phoneNumber);
      const firstMediationAppointmentDate = nativeElement.querySelector('#firstMediationAppointmentDate');
      expect(firstMediationAppointmentDate.value).toBe('01/12/2017');
      const maritalStatus: HTMLSelectElement = nativeElement.querySelector('#maritalStatus');
      expect(maritalStatus.options[maritalStatus.selectedIndex].value).toBe(person.maritalStatus);
      const adherentYes = nativeElement.querySelector('#adherenttrue');
      expect(adherentYes.checked).toBe(true);
      const adherentNo = nativeElement.querySelector('#adherentfalse');
      expect(adherentNo.checked).toBe(false);
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
      const fiscalStatusDate = nativeElement.querySelector('#fiscalStatusDate');
      expect(fiscalStatusDate.value).toBe('01/02/2017');
      const fiscalStatusUpToDate = nativeElement.querySelector('#fiscalStatusUpToDate');
      expect(fiscalStatusUpToDate.checked).toBe(person.fiscalStatusUpToDate);
      const healthCareCoverage: HTMLSelectElement = nativeElement.querySelector('#healthCareCoverage');
      expect(healthCareCoverage.options[healthCareCoverage.selectedIndex].value).toBe(person.healthCareCoverage);
      const accompanying = nativeElement.querySelector('#accompanying');
      expect(accompanying.value).toBe(person.accompanying);
      const socialSecurityNumber = nativeElement.querySelector('#socialSecurityNumber');
      expect(socialSecurityNumber.value).toBe(person.socialSecurityNumber);
      const cafNumber = nativeElement.querySelector('#cafNumber');
      expect(cafNumber.value).toBe(person.cafNumber);
      const frenchFamilySituation = nativeElement.querySelector('#frenchFamilySituation');
      expect(frenchFamilySituation.textContent).not.toContain('Inconnue');
      expect(frenchFamilySituation.textContent).not.toContain('Renseigner');
      expect(frenchFamilySituation.textContent).toContain('Rendre inconnue');
      expect(frenchFamilySituation.querySelector('gl-family-situation-edit')).toBeTruthy();
      expect(fixture.debugElement.query(By.directive(FamilySituationEditComponent)).componentInstance.situation)
        .toBe(fixture.componentInstance.personForm.get('frenchFamilySituation'));

      const abroadFamilySituation = nativeElement.querySelector('#abroadFamilySituation');
      expect(abroadFamilySituation.textContent).toContain('Inconnue');
      expect(abroadFamilySituation.textContent).toContain('Renseigner');
      expect(abroadFamilySituation.textContent).not.toContain('Rendre inconnue');
      expect(abroadFamilySituation.querySelector('gl-family-situation-edit')).toBeFalsy();

      lastName.value = 'Do';
      lastName.dispatchEvent(new Event('input'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(personService.update).toHaveBeenCalled();

      const idUpdated = personService.update.calls.argsFor(0)[0];
      expect(idUpdated).toBe(42);
      const personUpdated = personService.update.calls.argsFor(0)[1];
      expect(personUpdated.lastName).toBe('Do');
      expect(personUpdated.firstName).toBe('John');

      expect(router.navigate).toHaveBeenCalledWith(['persons', 42]);
    });

    it('should clear the city input on blur if not valid anymore', () =>  {
      const displayCityPipe = TestBed.get(DisplayCityPipe);
      const fixture = TestBed.createComponent(PersonEditComponent);
      // fake typeahead results
      fixture.componentInstance.search = (text: Observable<string>) => text.map(value => []);

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const city: HTMLInputElement = nativeElement.querySelector('#city');
      expect(city.value).toBe(displayCityPipe.transform(person.city));

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

    it('should make family situation known and then unknown', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement;
      const component = fixture.componentInstance;

      expect(component.personForm.contains('abroadFamilySituation')).toBeFalsy();

      const abroadFamilySituation = nativeElement.querySelector('#abroadFamilySituation');
      const makeKnownButton = abroadFamilySituation.querySelector('button');
      expect(makeKnownButton.textContent).toContain('Renseigner');

      makeKnownButton.click();
      fixture.detectChanges();
      expect(component.personForm.contains('abroadFamilySituation')).toBeTruthy();

      const familySituationEditComponent: FamilySituationEditComponent =
        fixture.debugElement.query(By.css('#abroadFamilySituation gl-family-situation-edit')).componentInstance;
      expect(familySituationEditComponent.situation).toBe(component.personForm.get('abroadFamilySituation') as FormGroup);

      const makeUnknownButton = abroadFamilySituation.querySelector('button');
      expect(makeUnknownButton.textContent).toContain('Rendre inconnue');

      makeUnknownButton.click();
      fixture.detectChanges();
      expect(component.personForm.contains('abroadFamilySituation')).toBeFalsy();
    });
  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: {data: {person: null}}
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
      spyOn(personService, 'create').and.returnValue(Observable.of({id: 43} as PersonModel));
      const router = TestBed.get(Router);
      spyOn(router, 'navigate');
      const displayCityPipe = TestBed.get(DisplayCityPipe);
      const fixture = TestBed.createComponent(PersonEditComponent);
      // fake typeahead results
      fixture.componentInstance.search = (text: Observable<string>) => Observable.of([cityModel]);

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
      const adherentYes = nativeElement.querySelector('#adherenttrue');
      expect(adherentYes.checked).toBe(false);
      const adherentNo = nativeElement.querySelector('#adherentfalse');
      expect(adherentNo.checked).toBe(true);

      const mediationEnabledYes = nativeElement.querySelector('#mediationEnabledtrue');
      expect(mediationEnabledYes.checked).toBe(false);
      const mediationEnabledNo = nativeElement.querySelector('#mediationEnabledfalse');
      expect(mediationEnabledNo.checked).toBe(true);

      const mediationDependantIds =
        ['mediationCode', 'firstMediationAppointmentDate', 'maritalStatus', 'entryDate', 'housing', 'hostName', 'fiscalStatusUNKNOWN',
          'socialSecurityNumber', 'cafNumber', 'frenchFamilySituation', 'abroadFamilySituation'];

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
      let fiscalStatusDate = nativeElement.querySelector('#fiscalStatusDate');
      expect(fiscalStatusDate).toBeFalsy();
      let fiscalStatusUpToDate = nativeElement.querySelector('#fiscalStatusUpToDate');
      expect(fiscalStatusUpToDate).toBeFalsy();
      const accompanying = nativeElement.querySelector('#accompanying');
      expect(accompanying.value).toBe('');
      const socialSecurityNumber = nativeElement.querySelector('#socialSecurityNumber');
      expect(socialSecurityNumber.value).toBe('');
      const cafNumber = nativeElement.querySelector('#cafNumber');
      expect(cafNumber.value).toBe('');
      const frenchFamilySituation = nativeElement.querySelector('#frenchFamilySituation');
      expect(frenchFamilySituation.textContent).toContain('Inconnue');

      const abroadFamilySituation = nativeElement.querySelector('#abroadFamilySituation');
      expect(abroadFamilySituation.textContent).toContain('Inconnue');

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
      const result = nativeElement.querySelector('button');
      expect(result.textContent)
        .toContain(displayCityPipe.transform(cityModel));
      result.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick();

      email.value = 'jane@mail.com';
      email.dispatchEvent(new Event('input'));
      phoneNumber.value = '06 13 13 13 13';
      phoneNumber.dispatchEvent(new Event('input'));
      maritalStatus.selectedIndex = 2;
      maritalStatus.dispatchEvent(new Event('change'));
      adherentYes.checked = true;
      adherentYes.dispatchEvent(new Event('change'));
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
      hostName.dispatchEvent(new Event('change'))
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

      fiscalStatusDate = nativeElement.querySelector('#fiscalStatusDate');
      expect(fiscalStatusDate).toBeTruthy();
      fiscalStatusDate.value = '01/01/2015';
      fiscalStatusDate.dispatchEvent(new Event('change'));
      fiscalStatusUpToDate = nativeElement.querySelector('#fiscalStatusUpToDate');
      expect(fiscalStatusUpToDate).toBeTruthy();
      fiscalStatusUpToDate.checked = true;
      fiscalStatusUpToDate.dispatchEvent(new Event('change'));

      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();
      tick();
      expect(entryDate.value).toBe('02/02/2015');

      expect(personService.create).toHaveBeenCalled();

      const createdPerson = personService.create.calls.argsFor(0)[0] as PersonCommand;
      expect(createdPerson.lastName).toBe('Doe');
      expect(createdPerson.firstName).toBe('Jane');
      expect(createdPerson.birthName).toBe('Jos')
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
      expect(createdPerson.adherent).toBe(true);
      expect(createdPerson.entryDate).toBe('2015-02-02');
      expect(createdPerson.housing).toBe('F0');
      expect(createdPerson.housingSpace).toBe(30);
      expect(createdPerson.hostName).toBe('')
      expect(createdPerson.accompanying).toBe('Paulette');
      expect(createdPerson.socialSecurityNumber).toBe('453287654309876');
      expect(createdPerson.cafNumber).toBe('78654');
      expect(createdPerson.fiscalStatus).toBe('TAXABLE');
      expect(createdPerson.fiscalStatusDate).toBe('2015-01-01');
      expect(createdPerson.fiscalStatusUpToDate).toBe(true);

      expect(router.navigate).toHaveBeenCalledWith(['persons', 43]);
    }));
  });
});
