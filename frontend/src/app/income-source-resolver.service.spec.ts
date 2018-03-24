import { TestBed } from '@angular/core/testing';

import { IncomeSourceResolverService } from './income-source-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { IncomeSourceModel } from './models/income-source.model';
import { IncomeSourceService } from './income-source.service';

describe('IncomeSourceResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should retrieve a source', () => {
    const incomeSourceService = TestBed.get(IncomeSourceService);
    const expectedResult: Observable<IncomeSourceModel> = of({ id: 42, name: 'Allocations Familiales' } as IncomeSourceModel);

    spyOn(incomeSourceService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.get(IncomeSourceResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);
    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;

    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(incomeSourceService.get).toHaveBeenCalledWith(42);
  });
});
