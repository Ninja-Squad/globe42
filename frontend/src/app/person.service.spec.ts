import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PersonService } from './person.service';
import { PersonModel, PersonWithRemindersModel } from './models/person.model';
import { PersonCommand } from './models/person.command';
import { HttpTester } from './http-tester.spec';

describe('PersonService', () => {
  let service: PersonService;
  let httpTester: HttpTester;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(PersonService);
    http = TestBed.inject(HttpTestingController);
    httpTester = new HttpTester(http);
  });

  it('should get a person', () => {
    const expectedPerson = { id: 1 } as PersonModel;
    httpTester.testGet('/api/persons/1', expectedPerson, service.get(1));
  });

  it('should update a person', () => {
    const fakePerson = { firstName: 'Ced' } as PersonCommand;
    httpTester.testPut('/api/persons/2', fakePerson, service.update(2, fakePerson));
  });

  it('should create a person', () => {
    const fakePerson = { nickName: 'ced' } as PersonCommand;
    const expectedPerson = { id: 2 } as PersonModel;
    httpTester.testPost('/api/persons', fakePerson, expectedPerson, service.create(fakePerson));
  });

  it('should list persons', () => {
    const expectedPersons = [{ id: 1 }] as Array<PersonModel>;
    httpTester.testGet('/api/persons', expectedPersons, service.list());
  });

  it('should delete a person', () => {
    httpTester.testDelete('/api/persons/1', service.delete(1));
  });

  it('should resurrect a person', () => {
    httpTester.testDelete('/api/persons/1/deletion', service.resurrect(1));
  });

  it('should signal the death of a person', () => {
    const command = { deathDate: '2019-07-26' };
    httpTester.testPut('/api/persons/2/death', command, service.signalDeath(2, command));
  });

  it('should list persons with reminders', () => {
    const backendPersons = [
      { id: 1, firstName: 'JB', lastName: 'Nizet' },
      { id: 2, firstName: 'Claire', lastName: 'Brucy' }
    ] as Array<PersonWithRemindersModel>;
    const expectedPersons = [backendPersons[1], backendPersons[0]];
    let actualPersons: Array<PersonWithRemindersModel>;

    service.listWithReminders().subscribe(p => (actualPersons = p));
    http.expectOne({ method: 'GET', url: '/api/persons/with-reminders' }).flush(backendPersons);
    expect(actualPersons).toEqual(expectedPersons);
  });
});
