import { TestBed, inject } from '@angular/core/testing';

import { ChargeService } from './charge.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChargeCommand } from './models/charge.command';
import { ChargeModel } from './models/charge.model';

describe('ChargeService', () => {
  let http: HttpTestingController;
  let service: ChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChargeService
      ],
      imports: [HttpClientTestingModule]
    });

    http = TestBed.get(HttpTestingController);
    service = TestBed.get(ChargeService);
  });

  it('should list charges of a person', () => {
    const expectedCharges = [{ id: 1 }] as Array<ChargeModel>;

    let actualCharges;
    service.list(42).subscribe(charges => actualCharges = charges);

    http.expectOne({url: '/api/persons/42/charges', method: 'GET'}).flush(expectedCharges);

    expect(actualCharges).toEqual(expectedCharges);
  });

  it('should delete an charge of a person', () => {
    service.delete(42, 12).subscribe();

    http.expectOne({url: '/api/persons/42/charges/12', method: 'DELETE'}).flush(null);
  });

  it('should create an charge for a person', () => {
    const fakeChargeCommand: ChargeCommand = { typeId: 12, monthlyAmount: 340 };
    const expectedCharge = { id: 2 } as ChargeModel;

    let actualCharge;
    service.create(42, fakeChargeCommand).subscribe(charge => actualCharge = charge);

    const testRequest = http.expectOne({ url: '/api/persons/42/charges', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeChargeCommand);
    testRequest.flush(expectedCharge);

    expect(actualCharge).toEqual(expectedCharge);
  });
});
