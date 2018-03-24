import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PersonService } from './person.service';
import { PersonModel } from './models/person.model';
import { PersonCommand } from './models/person.command';
import { HttpTester } from './http-tester.spec';

describe('PersonService', () => {

  let service: PersonService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(PersonService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
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
});
