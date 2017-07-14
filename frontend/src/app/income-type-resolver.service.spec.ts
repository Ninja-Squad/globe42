import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IncomeService } from './income.service';
import { IncomeTypeResolverService } from './income-type-resolver.service';
import { IncomeTypeModel } from './models/income.model';

describe('IncomeTypeResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IncomeTypeResolverService, IncomeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const incomeService = TestBed.get(IncomeService);
    const expectedResult: Observable<IncomeTypeModel> = Observable.of({ id: 42, type: 'CAF' });

    spyOn(incomeService, 'getType').and.returnValue(expectedResult);

    const resolver = TestBed.get(IncomeTypeResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(incomeService.getType).toHaveBeenCalledWith(42);
  });
});
