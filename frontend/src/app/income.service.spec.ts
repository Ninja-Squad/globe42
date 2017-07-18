import { TestBed, inject } from '@angular/core/testing';

import { IncomeService } from './income.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IncomeModel } from './models/income.model';

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
});
