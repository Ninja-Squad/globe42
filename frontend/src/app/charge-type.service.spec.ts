import { TestBed, inject } from '@angular/core/testing';

import { ChargeTypeService } from './charge-type.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChargeTypeModel } from './models/charge-type.model';
import { ChargeTypeCommand } from './models/charge-type.command';

describe('ChargeTypeService', () => {

  let http: HttpTestingController;
  let service: ChargeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChargeTypeService
      ],
      imports: [HttpClientTestingModule]
    });

    http = TestBed.get(HttpTestingController);
    service = TestBed.get(ChargeTypeService);
  });

  it('should get a charge type', () => {
    const expectedChargeType = { id: 1 } as ChargeTypeModel;

    let actualChargeType;
    service.get(1).subscribe(chargeType => actualChargeType = chargeType);
    http.expectOne({url: '/api/charge-types/1', method: 'GET'}).flush(expectedChargeType);

    expect(actualChargeType).toEqual(expectedChargeType);
  });

  it('should update a charge type', () => {
    const fakeChargeType = { name: 'rental' } as ChargeTypeCommand;
    service.update(2, fakeChargeType).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/charge-types/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(fakeChargeType);
    testRequest.flush(null);
  });

  it('should create a charge type', () => {
    const fakeChargeType = { name: 'foo' } as ChargeTypeCommand;
    const expectedChargeType = { id: 2 } as ChargeTypeModel;

    let actualChargeType;
    service.create(fakeChargeType).subscribe(chargeType => actualChargeType = chargeType);

    const testRequest = http.expectOne({ url: '/api/charge-types', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeChargeType);
    testRequest.flush(expectedChargeType);

    expect(actualChargeType).toEqual(expectedChargeType);
  });

  it('should list charge types', () => {
    const expectedChargeTypes = [{ id: 1 }] as Array<ChargeTypeModel>;

    let actualChargeTypes;
    service.list().subscribe(chargeTypes => actualChargeTypes = chargeTypes);

    http.expectOne({url: '/api/charge-types', method: 'GET'}).flush(expectedChargeTypes);

    expect(actualChargeTypes).toEqual(expectedChargeTypes);
  });
});
