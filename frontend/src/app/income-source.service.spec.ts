import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncomeSourceCommand } from './models/income-source.command';
import { IncomeSourceModel } from './models/income-source.model';
import { IncomeSourceService } from './income-source.service';
import { HttpTester } from './http-tester.spec';

describe('IncomeSourceService', () => {

  let httpTester: HttpTester;
  let service: IncomeSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncomeSourceService
      ],
      imports: [HttpClientTestingModule]
    });

    const http = TestBed.get(HttpTestingController);
    httpTester = new HttpTester(http);
    service = TestBed.get(IncomeSourceService);
  });

  it('should get an income source', () => {
    const expectedIncomeSource = { id: 1 } as IncomeSourceModel;
    httpTester.testGet('/api/income-sources/1', expectedIncomeSource, service.get(1));
  });

  it('should update an income source', () => {
    const fakeIncomeSourceCommand = { name: 'foo' } as IncomeSourceCommand;
    httpTester.testPut('/api/income-sources/2', fakeIncomeSourceCommand, service.update(2, fakeIncomeSourceCommand));
  });

  it('should create a income source', () => {
    const fakeIncomeSourceCommand = { name: 'foo' } as IncomeSourceCommand;
    const expectedIncomeSource = { id: 2 } as IncomeSourceModel;
    httpTester.testPost('/api/income-sources', fakeIncomeSourceCommand, expectedIncomeSource, service.create(fakeIncomeSourceCommand));
  });

  it('should list income sources', () => {
    const expectedIncomeSources = [{ id: 1 }] as Array<IncomeSourceModel>;
    httpTester.testGet('/api/income-sources', expectedIncomeSources, service.list());
  });
});
