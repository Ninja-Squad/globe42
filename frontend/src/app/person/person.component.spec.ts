import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { PersonComponent } from './person.component';
import { CityModel, PersonModel } from '../models/person.model';
import { DisplayGenderPipe } from '../display-gender.pipe';
import { DisplayMaritalStatusPipe } from '../display-marital-status.pipe';
import { DisplayCityPipe } from '../display-city.pipe';
import { DisplayFiscalStatusPipe } from '../display-fiscal-status.pipe';
import { PersonFamilySituationComponent } from '../person-family-situation/person-family-situation.component';
import { FamilySituationComponent } from '../family-situation/family-situation.component';
import { DisplayHousingPipe } from '../display-housing.pipe';
import { LOCALE_ID } from '@angular/core';

describe('PersonComponent', () => {
  const cityModel: CityModel = {
    code: 42000,
    city: 'SAINT-ETIENNE'
  };
  const person: PersonModel = {
    id: 0,
    firstName: 'John',
    lastName: 'Doe',
    nickName: 'john',
    mediationCode: 'D1',
    birthDate: '1980-01-01',
    address: 'Chemin de la gare',
    city: cityModel,
    email: 'john@mail.com',
    adherent: true,
    entryDate: '2016-12-01',
    gender: 'MALE',
    phoneNumber: '06 12 34 56 78',
    maritalStatus: 'SINGLE',
    housing: 'F6',
    housingSpace: 80,
    fiscalStatus: 'TAXABLE',
    fiscalStatusUpToDate: true,
    fiscalStatusDate: '2017-02-01',
    frenchFamilySituation: null,
    abroadFamilySituation: null
  };

  const activatedRoute: any = {
    parent: {
      snapshot: { data: { person } }
    }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule ],
    declarations: [
      PersonComponent,
      PersonFamilySituationComponent,
      FamilySituationComponent,
      DisplayGenderPipe,
      DisplayMaritalStatusPipe,
      DisplayCityPipe,
      DisplayFiscalStatusPipe,
      DisplayHousingPipe
    ],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: LOCALE_ID, useValue: 'fr-FR'}
    ]
  })));

  it('should have a maps URL', () => {
    const component = new PersonComponent(activatedRoute);
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
    expect(birthDate.textContent).toBe('1980-01-01');
    const email = nativeElement.querySelector('#email');
    expect(email.textContent).toContain('john@mail.com');
    const phoneNumber = nativeElement.querySelector('#phoneNumber');
    expect(phoneNumber.textContent).toContain('06 12 34 56 78');
    const adherent = nativeElement.querySelector('#adherent');
    expect(adherent.textContent).toBe('Oui');
    const entryDate = nativeElement.querySelector('#entryDate');
    expect(entryDate.textContent).toBe('2016-12-01');
    const mediationCode = nativeElement.querySelector('#mediationCode');
    expect(mediationCode.textContent).toBe('D1');
    const maritalStatus = nativeElement.querySelector('#maritalStatus');
    expect(maritalStatus.textContent).toBe('Célibataire');
    const housing = nativeElement.querySelector('#housing');
    expect(housing.textContent).toContain('F6 ou plus');
    expect(housing.textContent).toContain('80 m2');
    const fiscalStatus = nativeElement.querySelector('#fiscalStatus');
    expect(fiscalStatus.textContent).toContain('Imposable');
    expect(fiscalStatus.textContent).toContain('établie le 1 févr. 2017');
    expect(fiscalStatus.textContent).toContain('à jour');
  });
});
