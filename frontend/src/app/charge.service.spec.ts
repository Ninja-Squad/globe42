import { TestBed } from '@angular/core/testing';

import { ChargeService } from './charge.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChargeCommand } from './models/charge.command';
import { ChargeModel } from './models/charge.model';
import { HttpTester } from './http-tester.spec';

describe('ChargeService', () => {
  let httpTester: HttpTester;
  let service: ChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const http = TestBed.get(HttpTestingController);
    httpTester = new HttpTester(http);
    service = TestBed.get(ChargeService);
  });

  it('should list charges of a person', () => {
    const expectedCharges = [{ id: 1 }] as Array<ChargeModel>;
    httpTester.testGet('/api/persons/42/charges', expectedCharges, service.list(42));
  });

  it('should delete an charge of a person', () => {
    httpTester.testDelete('/api/persons/42/charges/12', service.delete(42, 12));
  });

  it('should create an charge for a person', () => {
    const fakeChargeCommand: ChargeCommand = { typeId: 12, monthlyAmount: 340 };
    const expectedCharge = { id: 2 } as ChargeModel;
    httpTester.testPost(
      '/api/persons/42/charges',
      fakeChargeCommand,
      expectedCharge,
      service.create(42, fakeChargeCommand));
  });
});
