import { TestBed } from '@angular/core/testing';

import { FamilyService } from './family.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpTester } from './http-tester.spec';
import { FamilyCommand } from './models/family.command';
import { FamilyModel } from './models/family.model';

describe('FamilyService', () => {
  let service: FamilyService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(FamilyService);
    httpTester = new HttpTester(TestBed.inject(HttpTestingController));
  });

  it('should get family of person', () => {
    httpTester.testGet('/api/persons/42/family', {} as FamilyModel, service.get(42));
  });

  it('should get save family of person', () => {
    const command = {} as FamilyCommand;
    httpTester.testPut('/api/persons/42/family', command, service.save(42, command));
  });

  it('should delete family of person', () => {
    httpTester.testDelete('/api/persons/42/family', service.delete(42));
  });
});
