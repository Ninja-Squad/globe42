import { TestBed } from '@angular/core/testing';

import { HealthCareCoverageResolverService } from './health-care-coverage-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { HealthCareCoverageService } from './health-care-coverage.service';
import { HealthCareCoverageModel } from './models/health-care-coverage.model';

describe('HeathcareCoverageResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve health care coverage', () => {
    const healthCareCoverageService = TestBed.inject(HealthCareCoverageService);
    const expectedResult = of({ entries: [] } as HealthCareCoverageModel);

    spyOn(healthCareCoverageService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.inject(HealthCareCoverageResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResult);
    expect(healthCareCoverageService.get).toHaveBeenCalled();
  });
});
