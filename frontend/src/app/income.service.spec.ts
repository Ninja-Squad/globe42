import { TestBed, inject } from '@angular/core/testing';

import { IncomeService } from './income.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IncomeModel } from './models/income.model';
import { IncomeCommand } from './models/income.command';

describe('IncomeService', () => {
  let http: HttpTestingController;
  let service: IncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncomeService
      ],
      imports: [HttpClientTestingModule]
    });

    http = TestBed.get(HttpTestingController);
    service = TestBed.get(IncomeService);
  });

  it('should list incomes of a person', () => {
    const expectedIncomes: Array<IncomeModel> = [{ id: 1 }] as Array<IncomeModel>;

    let actualIncomes;
    service.list(42).subscribe(incomes => actualIncomes = incomes);

    http.expectOne({url: '/api/persons/42/incomes', method: 'GET'}).flush(expectedIncomes);

    expect(actualIncomes).toEqual(expectedIncomes);
  });

  it('should delete an income of a person', () => {
    service.delete(42, 12).subscribe();

    http.expectOne({url: '/api/persons/42/incomes/12', method: 'DELETE'}).flush(null);
  });

  it('should create an income for a person', () => {
    const fakeIncomeCommand: IncomeCommand = { sourceId: 12, monthlyAmount: 340 };
    const expectedIncome: IncomeModel = { id: 2 } as IncomeModel;

    let actualIncome;
    service.create(42, fakeIncomeCommand).subscribe(income => actualIncome = income);

    const testRequest = http.expectOne({ url: '/api/persons/42/incomes', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeIncomeCommand);
    testRequest.flush(expectedIncome);

    expect(actualIncome).toEqual(expectedIncome);
  });


});
