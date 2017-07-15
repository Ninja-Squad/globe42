import { TestBed } from '@angular/core/testing';

import { IncomeSourcesResolverService } from './income-sources-resolver.service';
import { IncomeService } from './income.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IncomeSourceModel } from './models/income.model';

describe('IncomeSourcesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IncomeSourcesResolverService, IncomeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const incomeService = TestBed.get(IncomeService);
    const expectedResults: Observable<Array<IncomeSourceModel>> = Observable.of([{ id: 42, name: 'Allocations Familiales' }]);

    spyOn(incomeService, 'listSources').and.returnValue(expectedResults);

    const resolver = TestBed.get(IncomeSourcesResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResults);
    expect(incomeService.listSources).toHaveBeenCalled();
  });
});
