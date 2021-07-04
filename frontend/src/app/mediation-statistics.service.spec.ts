import { TestBed } from '@angular/core/testing';

import { MediationStatisticsService } from './mediation-statistics.service';
import { HttpTester } from './http-tester.spec';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MediationReportModel } from './mediation-statistics.model';

describe('MediationStatisticsService', () => {
  let service: MediationStatisticsService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(MediationStatisticsService);
    httpTester = new HttpTester(TestBed.inject(HttpTestingController));
  });

  it('should get report', () => {
    httpTester.testGet(
      '/api/mediation-statistics?from=2021-01-01&to=2021-12-31',
      { appointmentCount: 0 } as MediationReportModel,
      service.get('2021-01-01', '2021-12-31')
    );
  });
});
