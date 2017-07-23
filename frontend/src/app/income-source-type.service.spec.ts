import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceTypeCommand } from './models/income-source-type.command';
import { IncomeSourceTypeService } from './income-source-type.service';

describe('IncomeSourceTypeService', () => {

  let http: HttpTestingController;
  let service: IncomeSourceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncomeSourceTypeService
      ],
      imports: [HttpClientTestingModule]
    });

    http = TestBed.get(HttpTestingController);
    service = TestBed.get(IncomeSourceTypeService);
  });

  it('should get an income type', () => {
    const expectedIncomeType = { id: 1 } as IncomeSourceTypeModel;

    let actualIncomeType;
    service.get(1).subscribe(incomeType => actualIncomeType = incomeType);
    http.expectOne({url: '/api/income-source-types/1', method: 'GET'}).flush(expectedIncomeType);

    expect(actualIncomeType).toEqual(expectedIncomeType);
  });

  it('should update an income type', () => {
    const fakeIncomeType = { type: 'CAF' } as IncomeSourceTypeCommand;
    service.update(2, fakeIncomeType).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/income-source-types/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(fakeIncomeType);
    testRequest.flush(null);
  });

  it('should create a income type', () => {
    const fakeIncomeType = { type: 'foo' } as IncomeSourceTypeCommand;
    const expectedIncomeType = { id: 2 } as IncomeSourceTypeModel;

    let actualIncomeType;
    service.create(fakeIncomeType).subscribe(incomeType => actualIncomeType = incomeType);

    const testRequest = http.expectOne({ url: '/api/income-source-types', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeIncomeType);
    testRequest.flush(expectedIncomeType);

    expect(actualIncomeType).toEqual(expectedIncomeType);
  });

  it('should list income types', () => {
    const expectedIncomeTypes = [{ id: 1 }] as Array<IncomeSourceTypeModel>;

    let actualIncomeTypes;
    service.list().subscribe(incomeTypes => actualIncomeTypes = incomeTypes);

    http.expectOne({url: '/api/income-source-types', method: 'GET'}).flush(expectedIncomeTypes);

    expect(actualIncomeTypes).toEqual(expectedIncomeTypes);
  });
});
