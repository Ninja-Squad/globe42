import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncomeSourceCommand } from './models/income-source.command';
import { IncomeSourceModel } from './models/income-source.model';
import { IncomeSourceService } from './income-source.service';

describe('IncomeSourceService', () => {

  let http: HttpTestingController;
  let service: IncomeSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncomeSourceService
      ],
      imports: [HttpClientTestingModule]
    });

    http = TestBed.get(HttpTestingController);
    service = TestBed.get(IncomeSourceService);
  });

  it('should get an income source', () => {
    const expectedIncomeSource: IncomeSourceModel = { id: 1 } as IncomeSourceModel;

    let actualIncomeSource;
    service.get(1).subscribe(incomeSource => actualIncomeSource = incomeSource);
    http.expectOne({url: '/api/income-sources/1', method: 'GET'}).flush(expectedIncomeSource);

    expect(actualIncomeSource).toEqual(expectedIncomeSource);
  });

  it('should update an income source', () => {
    const fakeIncomeSourceCommand: IncomeSourceCommand = { name: 'foo' } as IncomeSourceCommand;
    service.update(2, fakeIncomeSourceCommand).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/income-sources/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(fakeIncomeSourceCommand);
    testRequest.flush(null);
  });

  it('should create a income source', () => {
    const fakeIncomeSourceCommand: IncomeSourceCommand = { name: 'foo' } as IncomeSourceCommand;
    const expectedIncomeSource: IncomeSourceModel = { id: 2 } as IncomeSourceModel;

    let actualIncomeSource;
    service.create(fakeIncomeSourceCommand).subscribe(incomeSource => actualIncomeSource = incomeSource);

    const testRequest = http.expectOne({ url: '/api/income-sources', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeIncomeSourceCommand);
    testRequest.flush(expectedIncomeSource);

    expect(actualIncomeSource).toEqual(expectedIncomeSource);
  });

  it('should list income sources', () => {
    const expectedIncomeSources: Array<IncomeSourceModel> = [{ id: 1 }] as Array<IncomeSourceModel>;

    let actualIncomeSources;
    service.list().subscribe(incomeSources => actualIncomeSources = incomeSources);

    http.expectOne({url: '/api/income-sources', method: 'GET'}).flush(expectedIncomeSources);

    expect(actualIncomeSources).toEqual(expectedIncomeSources);
  });
});
