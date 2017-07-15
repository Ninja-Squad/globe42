import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncomeService } from './income.service';
import { IncomeSourceModel, IncomeSourceTypeModel } from './models/income.model';
import { IncomeSourceCommand } from './models/income-source.command';

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
    const expectedIncomeType: IncomeSourceTypeModel = { id: 1 } as IncomeSourceTypeModel;

    let actualIncomeType;
    service.getType(1).subscribe(incomeType => actualIncomeType = incomeType);
    http.expectOne({url: '/api/income-source-types/1', method: 'GET'}).flush(expectedIncomeType);

    expect(actualIncomeType).toEqual(expectedIncomeType);
  });

  it('should update an income type', () => {
    const fakeIncomeType: IncomeSourceTypeModel = { id: 2 } as IncomeSourceTypeModel;
    service.updateType(fakeIncomeType).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/income-source-types/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(fakeIncomeType);
    testRequest.flush(null);
  });

  it('should create a income type', () => {
    const fakeIncomeType: IncomeSourceTypeModel = { type: 'foo' } as IncomeSourceTypeModel;
    const expectedIncomeType: IncomeSourceTypeModel = { id: 2 } as IncomeSourceTypeModel;

    let actualIncomeType;
    service.createType(fakeIncomeType).subscribe(incomeType => actualIncomeType = incomeType);

    const testRequest = http.expectOne({ url: '/api/income-source-types', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeIncomeType);
    testRequest.flush(expectedIncomeType);

    expect(actualIncomeType).toEqual(expectedIncomeType);
  });

  it('should list income types', () => {
    const expectedIncomeTypes: Array<IncomeSourceTypeModel> = [{ id: 1 }] as Array<IncomeSourceTypeModel>;

    let actualIncomeTypes;
    service.listTypes().subscribe(incomeTypes => actualIncomeTypes = incomeTypes);

    http.expectOne({url: '/api/income-source-types', method: 'GET'}).flush(expectedIncomeTypes);

    expect(actualIncomeTypes).toEqual(expectedIncomeTypes);
  });

  it('should get an income source', () => {
    const expectedIncomeSource: IncomeSourceModel = { id: 1 } as IncomeSourceModel;

    let actualIncomeSource;
    service.getSource(1).subscribe(incomeSource => actualIncomeSource = incomeSource);
    http.expectOne({url: '/api/income-sources/1', method: 'GET'}).flush(expectedIncomeSource);

    expect(actualIncomeSource).toEqual(expectedIncomeSource);
  });

  it('should update an income source', () => {
    const fakeIncomeSourceCommand: IncomeSourceCommand = { name: 'foo' } as IncomeSourceCommand;
    service.updateSource(2, fakeIncomeSourceCommand).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/income-sources/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(fakeIncomeSourceCommand);
    testRequest.flush(null);
  });

  it('should create a income source', () => {
    const fakeIncomeSourceCommand: IncomeSourceCommand = { name: 'foo' } as IncomeSourceCommand;
    const expectedIncomeSource: IncomeSourceModel = { id: 2 } as IncomeSourceModel;

    let actualIncomeSource;
    service.createSource(fakeIncomeSourceCommand).subscribe(incomeSource => actualIncomeSource = incomeSource);

    const testRequest = http.expectOne({ url: '/api/income-sources', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeIncomeSourceCommand);
    testRequest.flush(expectedIncomeSource);

    expect(actualIncomeSource).toEqual(expectedIncomeSource);
  });

  it('should list income sources', () => {
    const expectedIncomeSources: Array<IncomeSourceModel> = [{ id: 1 }] as Array<IncomeSourceModel>;

    let actualIncomeSources;
    service.listSources().subscribe(incomeSources => actualIncomeSources = incomeSources);

    http.expectOne({url: '/api/income-sources', method: 'GET'}).flush(expectedIncomeSources);

    expect(actualIncomeSources).toEqual(expectedIncomeSources);
  });
});
