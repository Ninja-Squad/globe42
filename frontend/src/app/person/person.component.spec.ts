import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { PersonComponent } from './person.component';
import { CityModel, PersonModel } from '../models/person.model';
import { DisplayGenderPipe } from '../display-gender.pipe';
import { DisplayMaritalStatusPipe } from '../display-marital-status.pipe';
import { DisplayCityPipe } from '../display-city.pipe';
import { DisplayFiscalStatusPipe } from '../display-fiscal-status.pipe';
import { DisplayHealthCareCoveragePipe } from '../display-health-care-coverage.pipe';
import { PersonFamilySituationComponent } from '../person-family-situation/person-family-situation.component';
import { FamilySituationComponent } from '../family-situation/family-situation.component';
import { DisplayHousingPipe } from '../display-housing.pipe';
import { LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { PersonNoteService } from '../person-note.service';
import { PersonResolverService } from '../person-resolver.service';
import { UserService } from '../user.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtInterceptorService } from '../jwt-interceptor.service';
import { PersonService } from '../person.service';
import { ConfirmService } from '../confirm.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoteComponent } from '../note/note.component';
import { FormsModule } from '@angular/forms';
import { PersonNotesComponent } from '../person-notes/person-notes.component';


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
    adherent: true,
    entryDate: '2016-12-01',
    gender: 'MALE',
    phoneNumber: '06 12 34 56 78',
    mediationEnabled: true,
    firstMediationAppointmentDate: '2017-12-01',
    maritalStatus: 'SINGLE',
    housing: 'F6',
    housingSpace: 80,
    hostName: 'Bruno Mala',
    fiscalStatus: 'TAXABLE',
    fiscalStatusDate: '2017-02-01',
    fiscalStatusUpToDate: true,
    healthCareCoverage: 'AME',
    accompanying: 'Paul',
    socialSecurityNumber: '277126912340454',
    cafNumber: '123765',
    frenchFamilySituation: null,
    abroadFamilySituation: null
  };

  const activatedRoute: any = {
    parent: {
      snapshot: { data: { person } }
    }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule, HttpClientModule, NgbModule.forRoot(), FormsModule ],
    declarations: [
      PersonComponent,
      DisplayGenderPipe,
      DisplayMaritalStatusPipe,
      DisplayCityPipe,
      DisplayFiscalStatusPipe,
      DisplayHousingPipe,
      DisplayHealthCareCoveragePipe
    ],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: LOCALE_ID, useValue: 'fr-FR'}
    ],
    schemas: [NO_ERRORS_SCHEMA]
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
    expect(birthDate.textContent).toBe('1 janv. 1980');
    const email = nativeElement.querySelector('#email');
    expect(email.textContent).toContain('john@mail.com');
    const phoneNumber = nativeElement.querySelector('#phoneNumber');
    expect(phoneNumber.textContent).toContain('06 12 34 56 78');
    const adherent = nativeElement.querySelector('#adherent');
    expect(adherent.textContent).toBe('Oui');
    const entryDate = nativeElement.querySelector('#entryDate');
    expect(entryDate.textContent).toBe('1 déc. 2016');
    const mediationCode = nativeElement.querySelector('#mediationCode');
    expect(mediationCode.textContent).toBe('D1');
    const firstMediationAppointmentDate = nativeElement.querySelector('#firstMediationAppointmentDate');
    expect(firstMediationAppointmentDate.textContent).toBe('1 déc. 2017');
    const maritalStatus = nativeElement.querySelector('#maritalStatus');
    expect(maritalStatus.textContent).toBe('Célibataire');
    const housing = nativeElement.querySelector('#housing');
    expect(housing.textContent).toContain('F6 ou plus');
    expect(housing.textContent).toContain('80 m2');
    const fiscalStatus = nativeElement.querySelector('#fiscalStatus');
    expect(fiscalStatus.textContent).toContain('Imposable');
    expect(fiscalStatus.textContent).toContain('établie le 1 févr. 2017');
    expect(fiscalStatus.textContent).toContain('à jour');
    const healthCareCoverage = nativeElement.querySelector('#healthCareCoverage');
    expect(healthCareCoverage.textContent).toContain('Aide médicale de l\'Etat');
    const accompanying = nativeElement.querySelector('#accompanying');
    expect(accompanying.textContent).toContain('Paul');
    const socialSecurityNumber = nativeElement.querySelector('#socialSecurityNumber');
    expect(socialSecurityNumber.textContent).toContain('277126912340454');
    const cafNumber = nativeElement.querySelector('#cafNumber');
    expect(cafNumber.textContent).toContain('123765');
  });

  it('should display a person with mediation disabled', () => {
    person.mediationEnabled = false;
    const fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const mediationDependantElementIds = ['entryDate', 'mediationCode', 'firstMediationAppointmentDate', 'maritalStatus', 'healthCareCoverage'];
    mediationDependantElementIds.forEach(id =>
      expect(nativeElement.querySelector(`#${id}`)).toBeFalsy(`#${id} should be absent`));
  });
});
