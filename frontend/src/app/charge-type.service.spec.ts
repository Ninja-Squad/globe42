import { TestBed } from '@angular/core/testing';

import { ChargeTypeService } from './charge-type.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChargeTypeModel } from './models/charge-type.model';
import { ChargeTypeCommand } from './models/charge-type.command';
import { HttpTester } from './http-tester.spec';

describe('ChargeTypeService', () => {

  let httpTester: HttpTester;
  let service: ChargeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChargeTypeService
      ],
      imports: [HttpClientTestingModule]
    });

    const http = TestBed.get(HttpTestingController);
    httpTester = new HttpTester(http);
    service = TestBed.get(ChargeTypeService);
  });

  it('should get a charge type', () => {
    const expectedChargeType = { id: 1 } as ChargeTypeModel;
    httpTester.testGet('/api/charge-types/1', expectedChargeType, service.get(1));
  });

  it('should update a charge type', () => {
    const fakeChargeType = { name: 'rental' } as ChargeTypeCommand;
    httpTester.testPut('/api/charge-types/2', fakeChargeType, service.update(2, fakeChargeType));
  });

  it('should create a charge type', () => {
    const fakeChargeType = { name: 'foo' } as ChargeTypeCommand;
    const expectedChargeType = { id: 2 } as ChargeTypeModel;
    httpTester.testPost('/api/charge-types', fakeChargeType, expectedChargeType, service.create(fakeChargeType));
  });

  it('should list charge types', () => {
    const expectedChargeTypes = [{ id: 1 }] as Array<ChargeTypeModel>;
    httpTester.testGet('/api/charge-types', expectedChargeTypes, service.list());
  });
});
