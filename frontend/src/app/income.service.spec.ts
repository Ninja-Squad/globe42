import { TestBed } from '@angular/core/testing';

import { IncomeService } from './income.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IncomeModel } from './models/income.model';
import { IncomeCommand } from './models/income.command';
import { HttpTester } from './http-tester.spec';

describe('IncomeService', () => {
  let httpTester: HttpTester;
  let service: IncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const http = TestBed.inject(HttpTestingController);
    httpTester = new HttpTester(http);
    service = TestBed.inject(IncomeService);
  });

  it('should list incomes of a person', () => {
    const expectedIncomes = [{ id: 1 }] as Array<IncomeModel>;
    httpTester.testGet('/api/persons/42/incomes', expectedIncomes, service.list(42));
  });

  it('should delete an income of a person', () => {
    httpTester.testDelete('/api/persons/42/incomes/12', service.delete(42, 12));
  });

  it('should create an income for a person', () => {
    const fakeIncomeCommand: IncomeCommand = { sourceId: 12, monthlyAmount: 340 };
    const expectedIncome = { id: 2 } as IncomeModel;
    httpTester.testPost(
      '/api/persons/42/incomes',
      fakeIncomeCommand,
      expectedIncome,
      service.create(42, fakeIncomeCommand));
  });
});
