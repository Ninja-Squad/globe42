import { async, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { IncomeService } from './income.service';
import { IncomeTypeModel } from './models/income.model';

describe('IncomeService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      { provide: Http, useFactory: (backend, options) => new Http(backend, options), deps: [MockBackend, BaseRequestOptions] },
      IncomeService
    ]
  }));

  it('should getType an income type', async(() => {
    const service: IncomeService = TestBed.get(IncomeService);
    const fakeIncomeType: IncomeTypeModel = { id: 1 } as IncomeTypeModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/income-source-types/1`);
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakeIncomeType })));
    });

    service.getType(1)
      .subscribe(incomeType => expect(incomeType).toBe(fakeIncomeType));
  }));

  it('should update a income type', async(() => {
    const service: IncomeService = TestBed.get(IncomeService);
    const fakeIncomeType: IncomeTypeModel = { id: 2 } as IncomeTypeModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/income-source-types/2`);
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(JSON.parse(connection.request.getBody())).toEqual(fakeIncomeType);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakeIncomeType })));
    });

    service.updateType(fakeIncomeType)
      .subscribe(() => {});
  }));

  it('should create a income type', async(() => {
    const service: IncomeService = TestBed.get(IncomeService);
    const fakeIncomeType: IncomeTypeModel = { id: 1 } as IncomeTypeModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/income-source-types`);
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(JSON.parse(connection.request.getBody())).toEqual(fakeIncomeType);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakeIncomeType })));
    });

    service.createType(fakeIncomeType)
      .subscribe(incomeType => expect(incomeType).toBe(fakeIncomeType));
  }));

  it('should list income types', async(() => {
    const service: IncomeService = TestBed.get(IncomeService);
    const fakeIncomeType: IncomeTypeModel = { id: 1 } as IncomeTypeModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/income-source-types`);
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(new ResponseOptions({ body: [fakeIncomeType] })));
    });

    service.listTypes()
      .subscribe(incomeTypes => expect(incomeTypes).toEqual([fakeIncomeType]));
  }));
});
