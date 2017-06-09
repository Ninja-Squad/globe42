import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { UserComponent } from './user.component';
import { AppModule } from '../app.module';
import { CityModel, UserModel } from '../models/user.model';

describe('UserComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };
  const user: UserModel = {
    id: 0, firstName: 'John', lastName: 'Doe', nickName: 'john', birthDate: '1980-01-01',
    mediationCode: 'code1', address: 'Chemin de la gare',
    city: cityModel, email: 'john@mail.com', isAdherent: true, entryDate: '2016-12-01',
    gender: 'male', phoneNumber: '06 12 34 56 78'
  };

  const activatedRoute = {
    snapshot: { data: { user } }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should display a user', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const name = nativeElement.querySelector('#fullName');
    expect(name.textContent).toBe('John Doe dit john');
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
    const adherent = nativeElement.querySelector('#isAdherent');
    expect(adherent.textContent).toBe('Oui');
    const entryDate = nativeElement.querySelector('#entryDate');
    expect(entryDate.textContent).toBe('2016-12-01');
    const mediationCode = nativeElement.querySelector('#mediationCode');
    expect(mediationCode.textContent).toBe('code1');
  });
});
