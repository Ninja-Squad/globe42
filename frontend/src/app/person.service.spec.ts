import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PersonService } from './person.service';
import { PersonModel } from './models/person.model';
import { PersonCommand } from './models/person.command';

describe('PersonService', () => {

  let service: PersonService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PersonService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(PersonService);
    http = TestBed.get(HttpTestingController);
  });

  it('should get a person', () => {
    const expectedPerson: PersonModel = { id: 1 } as PersonModel;

    let actualPerson;
    service.get(1).subscribe(person => actualPerson = person);

    http.expectOne({url: '/api/persons/1', method: 'GET'}).flush(expectedPerson);
    expect(actualPerson).toEqual(expectedPerson);

  });

  it('should update a person', () => {
    const fakePerson: PersonCommand = { firstName: 'Ced' } as PersonCommand;

    service.update(2, fakePerson).subscribe(() => {});

    const testRequest = http.expectOne({url: '/api/persons/2', method: 'PUT'});
    expect(testRequest.request.body).toEqual(fakePerson);
    testRequest.flush(null);
  });

  it('should create a person', () => {
    const fakePerson: PersonCommand = { nickName: 'ced' } as PersonCommand;
    const expectedPerson: PersonModel = { id: 2 } as PersonModel;

    let actualPerson;
    service.create(fakePerson).subscribe(person => actualPerson = person);

    const testRequest = http.expectOne({ url: '/api/persons', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakePerson);
    testRequest.flush(expectedPerson);

    expect(actualPerson).toEqual(expectedPerson);
  });

  it('should list persons', () => {
    const expectedPersons: Array<PersonModel> = [{ id: 1 }] as Array<PersonModel>;

    let actualPersons;
    service.list().subscribe(persons => actualPersons = persons);

    http.expectOne({url: '/api/persons', method: 'GET'}).flush(expectedPersons);

    expect(actualPersons).toEqual(expectedPersons);
  });
});
