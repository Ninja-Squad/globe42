import { TestBed } from '@angular/core/testing';

import { HealthCareCoverageService } from './health-care-coverage.service';
import { HttpTester } from './http-tester.spec';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HealthCareCoverageModel } from './models/health-care-coverage.model';

describe('HealthCareCoverageService', () => {
  let httpTester: HttpTester;
  let service: HealthCareCoverageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const http = TestBed.inject(HttpTestingController);
    httpTester = new HttpTester(http);
    service = TestBed.inject(HealthCareCoverageService);
  });

  it('should get the health care coverage', () => {
    const expected = { entries: [] } as HealthCareCoverageModel;
    httpTester.testGet('/api/health-care-coverage', expected, service.get());
  });
});
