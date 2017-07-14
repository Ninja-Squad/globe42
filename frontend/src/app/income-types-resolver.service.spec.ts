import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IncomeService } from './income.service';
import { IncomeTypesResolverService } from './income-types-resolver.service';
import { IncomeTypeModel } from './models/income.model';

describe('IncomeTypesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IncomeTypesResolverService, IncomeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const incomeService = TestBed.get(IncomeService);
    const expectedResults: Observable<Array<IncomeTypeModel>> = Observable.of([{ id: 42, type: 'CAF' }]);

    spyOn(incomeService, 'listTypes').and.returnValue(expectedResults);

    const resolver = TestBed.get(IncomeTypesResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResults);
    expect(incomeService.listTypes).toHaveBeenCalled();
  });
});
