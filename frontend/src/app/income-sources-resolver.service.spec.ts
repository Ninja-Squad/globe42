import { TestBed } from '@angular/core/testing';

import { IncomeSourcesResolverService } from './income-sources-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { IncomeSourceModel } from './models/income-source.model';
import { IncomeSourceService } from './income-source.service';
import { of } from 'rxjs';

describe('IncomeSourcesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should retrieve sources', () => {
    const incomeSourceService = TestBed.inject(IncomeSourceService);
    const expectedResults = of([{ id: 42, name: 'Allocations Familiales' }] as Array<IncomeSourceModel>);

    spyOn(incomeSourceService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.inject(IncomeSourcesResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResults);
    expect(incomeSourceService.list).toHaveBeenCalled();
  });
});
