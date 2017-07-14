import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncomeService } from './income.service';
import { IncomeTypeModel } from './models/income.model';

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

  it('should get an income type', () => {
    const expectedIncomeType: IncomeTypeModel = { id: 1 } as IncomeTypeModel;

    let actualIncomeType;
    service.getType(1).subscribe(incomeType => actualIncomeType = incomeType);
    http.expectOne({url: '/api/income-source-types/1', method: 'GET'}).flush(expectedIncomeType);

    expect(actualIncomeType).toEqual(expectedIncomeType);
  });

  it('should update an income type', () => {
    const fakeIncomeType: IncomeTypeModel = { id: 2 } as IncomeTypeModel;
    service.updateType(fakeIncomeType).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/income-source-types/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(fakeIncomeType);
    testRequest.flush(null);
  });

  it('should create a income type', () => {
    const fakeIncomeType: IncomeTypeModel = { type: 'foo' } as IncomeTypeModel;
    const expectedIncomeType: IncomeTypeModel = { id: 2 } as IncomeTypeModel;

    let actualIncomeType;
    service.createType(fakeIncomeType).subscribe(incomeType => actualIncomeType = incomeType);

    const testRequest = http.expectOne({ url: '/api/income-source-types', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeIncomeType);
    testRequest.flush(expectedIncomeType);

    expect(actualIncomeType).toEqual(expectedIncomeType);
  });

  it('should list income types', () => {
    const expectedIncomeTypes: Array<IncomeTypeModel> = [{ id: 1 }] as Array<IncomeTypeModel>;

    let actualIncomeTypes;
    service.listTypes().subscribe(incomeTypes => actualIncomeTypes = incomeTypes);

    http.expectOne({url: '/api/income-source-types', method: 'GET'}).flush(expectedIncomeTypes);

    expect(actualIncomeTypes).toEqual(expectedIncomeTypes);
  });
});
