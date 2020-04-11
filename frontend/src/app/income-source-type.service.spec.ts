import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceTypeCommand } from './models/income-source-type.command';
import { IncomeSourceTypeService } from './income-source-type.service';
import { HttpTester } from './http-tester.spec';

describe('IncomeSourceTypeService', () => {
  let httpTester: HttpTester;
  let service: IncomeSourceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTester = new HttpTester(TestBed.inject(HttpTestingController));
    service = TestBed.inject(IncomeSourceTypeService);
  });

  it('should get an income type', () => {
    const expectedIncomeType = { id: 1 } as IncomeSourceTypeModel;
    httpTester.testGet('/api/income-source-types/1', expectedIncomeType, service.get(1));
  });

  it('should update an income type', () => {
    const fakeIncomeType = { type: 'CAF' } as IncomeSourceTypeCommand;
    httpTester.testPut(
      '/api/income-source-types/2',
      fakeIncomeType,
      service.update(2, fakeIncomeType)
    );
  });

  it('should create a income type', () => {
    const fakeIncomeType = { type: 'foo' } as IncomeSourceTypeCommand;
    const expectedIncomeType = { id: 2 } as IncomeSourceTypeModel;
    httpTester.testPost(
      '/api/income-source-types',
      fakeIncomeType,
      expectedIncomeType,
      service.create(fakeIncomeType)
    );
  });

  it('should list income types', () => {
    const expectedIncomeTypes = [{ id: 1 }] as Array<IncomeSourceTypeModel>;
    httpTester.testGet('/api/income-source-types', expectedIncomeTypes, service.list());
  });
});
