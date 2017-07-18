import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { PersonComponent } from './person.component';
import { AppModule } from '../app.module';
import { CityModel, PersonModel } from '../models/person.model';

describe('PersonComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };
  const person: PersonModel = {
    id: 0, firstName: 'John', lastName: 'Doe', nickName: 'john', birthDate: '1980-01-01',
    mediationCode: 'D1', address: 'Chemin de la gare',
    city: cityModel, email: 'john@mail.com', adherent: true, entryDate: '2016-12-01',
    gender: 'MALE', phoneNumber: '06 12 34 56 78', maritalStatus: 'SINGLE'
  };

  const activatedRoute = {
    parent: {
      snapshot: { data: { person } }
    }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  })));

  it('should display a person', () => {
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const gender = nativeElement.querySelector('#gender');
    expect(gender.textContent).toBe('Homme');
    const address = nativeElement.querySelector('#fullAddress');
    expect(address.textContent).toBe('Chemin de la gare, 42000 SAINT-ETIENNE');
    const birthDate = nativeElement.querySelector('#birthDate');
    expect(birthDate.textContent).toBe('1980-01-01');
    const email = nativeElement.querySelector('#email');
    expect(email.textContent).toBe('john@mail.com');
    const phoneNumber = nativeElement.querySelector('#phoneNumber');
    expect(phoneNumber.textContent).toBe('06 12 34 56 78');
    const adherent = nativeElement.querySelector('#adherent');
    expect(adherent.textContent).toBe('Oui');
    const entryDate = nativeElement.querySelector('#entryDate');
    expect(entryDate.textContent).toBe('2016-12-01');
    const mediationCode = nativeElement.querySelector('#mediationCode');
    expect(mediationCode.textContent).toBe('D1');
    const maritalStatus = nativeElement.querySelector('#maritalStatus');
    expect(maritalStatus.textContent).toBe('Célibataire');
  });
});
