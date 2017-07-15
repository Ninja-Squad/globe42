import { TestBed, inject } from '@angular/core/testing';

import { IncomeSourceResolverService } from './income-source-resolver.service';
import { IncomeService } from './income.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IncomeSourceModel } from './models/income.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';

describe('IncomeSourceResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IncomeSourceResolverService, IncomeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a source', () => {
    const incomeService = TestBed.get(IncomeService);
    const expectedResult: Observable<IncomeSourceModel> = Observable.of({ id: 42, name: 'Allocations Familiales' });

    spyOn(incomeService, 'getSource').and.returnValue(expectedResult);

    const resolver = TestBed.get(IncomeSourceResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);
    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;

    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(incomeService.getSource).toHaveBeenCalledWith(42);
  });
});
