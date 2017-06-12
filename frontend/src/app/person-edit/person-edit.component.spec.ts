import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PersonEditComponent } from './person-edit.component';
import { AppModule } from '../app.module';
import { PersonService } from '../person.service';
import { CityModel, PersonModel } from '../models/person.model';
import { DisplayCityPipe } from '../display-city.pipe';

describe('PersonEditComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };

  describe('in edit mode', () => {
    const person: PersonModel = {
      id: 0, firstName: 'John', lastName: 'Doe', nickName: 'john', birthDate: '1980-01-01',
      mediationCode: 'code1', address: 'Chemin de la gare',
      city: cityModel, email: 'john@mail.com', adherent: true, entryDate: '2016-12-01',
      gender: 'male', phoneNumber: '06 12 34 56 78'
    };
    const activatedRoute = {
      snapshot: { data: { person } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

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
      const gender = nativeElement.querySelector('#genderMale');
      expect(gender.checked).toBe(true);
      const birthDate = nativeElement.querySelector('#birthDate');
      expect(birthDate.value).toBe(person.birthDate);
      const mediationCode = nativeElement.querySelector('#mediationCode');
      expect(mediationCode.value).toBe(person.mediationCode);
      const address = nativeElement.querySelector('#address');
      expect(address.value).toBe(person.address);
      const city = nativeElement.querySelector('#city');
      expect(city.value).toBe(displayCityPipe.transform(person.city));
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe(person.email);
      const phoneNumber = nativeElement.querySelector('#phoneNumber');
      expect(phoneNumber.value).toBe(person.phoneNumber);
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

      const personUpdated = personService.update.calls.argsFor(0)[0];
      expect(personUpdated.id).toBe(0);
      expect(personUpdated.lastName).toBe('Do');
      expect(personUpdated.firstName).toBe('John');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/persons');
    });

  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: { person: null } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

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
      const genderMale = nativeElement.querySelector('#genderMale');
      expect(genderMale.checked).toBe(false);
      const genderFemale = nativeElement.querySelector('#genderFemale');
      expect(genderFemale.checked).toBe(false);
      const genderOther = nativeElement.querySelector('#genderOther');
      expect(genderOther.checked).toBe(false);
      const birthDate = nativeElement.querySelector('#birthDate');
      expect(birthDate.value).toBe('');
      const mediationCode = nativeElement.querySelector('#mediationCode');
      expect(mediationCode.value).toBe('');
      const address = nativeElement.querySelector('#address');
      expect(address.value).toBe('');
      const city = nativeElement.querySelector('#city');
      expect(city.value).toBe('');
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe('');
      const phoneNumber = nativeElement.querySelector('#phoneNumber');
      expect(phoneNumber.value).toBe('');
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
      mediationCode.value = 'code2';
      mediationCode.dispatchEvent(new Event('input'));
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
      adherentYes.checked = true;
      adherentYes.dispatchEvent(new Event('change'));
      entryDate.value = '2015-02-02';
      entryDate.dispatchEvent(new Event('change'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(entryDate.value).toBe('2015-02-02');

      expect(personService.create).toHaveBeenCalled();

      const personUpdated = personService.create.calls.argsFor(0)[0] as PersonModel;
      expect(personUpdated.id).toBeUndefined();
      expect(personUpdated.lastName).toBe('Doe');
      expect(personUpdated.firstName).toBe('Jane');
      expect(personUpdated.nickName).toBe('jane');
      expect(personUpdated.gender).toBe('female');
      expect(personUpdated.birthDate).toBe('1985-03-03');
      expect(personUpdated.mediationCode).toBe('code2');
      expect(personUpdated.address).toBe('Avenue Liberté');
      expect(personUpdated.city.code).toBe(42000);
      expect(personUpdated.city.city).toBe('SAINT-ETIENNE');
      expect(personUpdated.email).toBe('jane@mail.com');
      expect(personUpdated.phoneNumber).toBe('06 13 13 13 13');
      expect(personUpdated.adherent).toBe(true);
      expect(personUpdated.entryDate).toBe('2015-02-02');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/persons');
    }));
  });
});
