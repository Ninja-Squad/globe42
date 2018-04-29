import { TestBed } from '@angular/core/testing';

import { PerUnitRevenueInformationService } from './per-unit-revenue-information.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpTester } from './http-tester.spec';
import { PerUnitRevenueInformationModel } from './models/per-unit-revenue-information.model';

const url = '/api/persons/42/per-unit-revenue';

describe('PerUnitRevenueInformationService', () => {
  let service: PerUnitRevenueInformationService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PerUnitRevenueInformationService]
    });

    service = TestBed.get(PerUnitRevenueInformationService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
  });

  it('should get', () => {
    const info: PerUnitRevenueInformationModel = {
      adultLikeCount: 3,
      childCount: 2,
      monoParental: true
    };
    httpTester.testGet(url, info, service.get(42));
  });

  it('should get when no info', () => {
    let actualBody: PerUnitRevenueInformationModel;
    service.get(42).subscribe(result => actualBody = result);

    TestBed.get(HttpTestingController).expectOne({url, method: 'GET'}).flush(null, {status: 204, statusText: 'No content'});

    expect(actualBody).toBeNull();
  });

  it('should delete', () => {
    httpTester.testDelete(url, service.delete(42));
  });

  it('should update', () => {
    const info: PerUnitRevenueInformationModel = {
      adultLikeCount: 3,
      childCount: 2,
      monoParental: true
    };
    httpTester.testPut(url, info, service.update(42, info));
  });
});
