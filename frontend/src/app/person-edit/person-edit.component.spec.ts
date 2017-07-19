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
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisplayGenderPipe } from '../display-gender.pipe';
import { SearchCityService } from '../search-city.service';

describe('PersonEditComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, NgbModule.forRoot()],
    declarations: [PersonEditComponent, DisplayMaritalStatusPipe, DisplayCityPipe, DisplayGenderPipe],
    providers: [ PersonService, DisplayCityPipe, SearchCityService ]
  })
  class TestModule {}

  describe('in edit mode', () => {
    const person: PersonModel = {
      id: 0, firstName: 'John', lastName: 'Doe', nickName: 'john', birthDate: '1980-01-01',
      mediationCode: 'code1', address: 'Chemin de la gare',
      city: cityModel, email: 'john@mail.com', adherent: true, entryDate: '2016-12-01',
      gender: 'MALE', phoneNumber: '06 12 34 56 78', maritalStatus: 'SINGLE'
    };
    const activatedRoute = {
      snapshot: { data: { person } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
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
      spyOn(router, 'navigateByUrl');
      const displayCityPipe = TestBed.get(DisplayCityPipe);
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const firstName = nativeElement.querySelector('#firstName');
      expect(firstName.value).toBe(person.firstName);
      const lastName = nativeElement.querySelector('#lastName');
      expect(lastName.value).toBe(person.lastName);
      const nickName = nativeElement.querySelector('#nickName');
      expect(nickName.value).toBe(person.nickName);
      const gender = nativeElement.querySelector('#genderMALE');
      expect(gender.checked).toBe(true);
      const birthDate = nativeElement.querySelector('#birthDate');
      expect(birthDate.value).toBe(person.birthDate);
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
      const maritalStatus: HTMLSelectElement = nativeElement.querySelector('#maritalStatus');
      expect(maritalStatus.options[maritalStatus.selectedIndex].value).toBe(person.maritalStatus);
      const adherentYes = nativeElement.querySelector('#adherentYes');
      expect(adherentYes.checked).toBe(true);
      const adherentNo = nativeElement.querySelector('#adherentNo');
      expect(adherentNo.checked).toBe(false);
      const entryDate = nativeElement.querySelector('#entryDate');
      expect(entryDate.value).toBe(person.entryDate);

      lastName.value = 'Do';
      lastName.dispatchEvent(new Event('input'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(personService.update).toHaveBeenCalled();

      const idUpdated = personService.update.calls.argsFor(0)[0];
      expect(idUpdated).toBe(0);
      const personUpdated = personService.update.calls.argsFor(0)[1];
      expect(personUpdated.lastName).toBe('Do');
      expect(personUpdated.firstName).toBe('John');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/persons');
    });

  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: { person: null } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(PersonEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvel adhérent');
    });


    it('should create and save a new person', fakeAsync(() => {
      const personService = TestBed.get(PersonService);
      spyOn(personService, 'create').and.returnValue(Observable.of(null));
      const router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');
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
      const mediationCode = nativeElement.querySelector('#mediationCode');
      expect(mediationCode.textContent).toContain('Généré automatiquement');
      const address = nativeElement.querySelector('#address');
      expect(address.value).toBe('');
      const city = nativeElement.querySelector('#city');
      expect(city.value).toBe('');
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe('');
      const phoneNumber = nativeElement.querySelector('#phoneNumber');
      expect(phoneNumber.value).toBe('');
      const maritalStatus: HTMLSelectElement = nativeElement.querySelector('#maritalStatus');
      expect(maritalStatus.selectedIndex).toBe(-1);
      expect(maritalStatus.options[0].value).toBe('');
      const adherentYes = nativeElement.querySelector('#adherentYes');
      expect(adherentYes.checked).toBe(false);
      const adherentNo = nativeElement.querySelector('#adherentNo');
      expect(adherentNo.checked).toBe(false);
      const entryDate = nativeElement.querySelector('#entryDate');
      expect(entryDate.value).toBe('');

      lastName.value = 'Doe';
      lastName.dispatchEvent(new Event('input'));
      firstName.value = 'Jane';
      firstName.dispatchEvent(new Event('input'));
      nickName.value = 'jane';
      nickName.dispatchEvent(new Event('input'));
      genderFemale.checked = true;
      genderFemale.dispatchEvent(new Event('change'));
      birthDate.value = '1985-03-03';
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
      entryDate.value = '2015-02-02';
      entryDate.dispatchEvent(new Event('change'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(entryDate.value).toBe('2015-02-02');

      expect(personService.create).toHaveBeenCalled();

      const createdPerson = personService.create.calls.argsFor(0)[0] as PersonCommand;
      expect(createdPerson.lastName).toBe('Doe');
      expect(createdPerson.firstName).toBe('Jane');
      expect(createdPerson.nickName).toBe('jane');
      expect(createdPerson.gender).toBe('FEMALE');
      expect(createdPerson.birthDate).toBe('1985-03-03');
      expect(createdPerson.mediationCode).toBeUndefined();
      expect(createdPerson.address).toBe('Avenue Liberté');
      expect(createdPerson.city.code).toBe(42000);
      expect(createdPerson.city.city).toBe('SAINT-ETIENNE');
      expect(createdPerson.email).toBe('jane@mail.com');
      expect(createdPerson.phoneNumber).toBe('06 13 13 13 13');
      expect(createdPerson.maritalStatus).toBe(MARITAL_STATUS_TRANSLATIONS[1].key);
      expect(createdPerson.adherent).toBe(true);
      expect(createdPerson.entryDate).toBe('2015-02-02');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/persons');
    }));
  });
});
