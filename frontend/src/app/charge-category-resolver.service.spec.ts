import { TestBed, inject } from '@angular/core/testing';

import { ChargeCategoryResolverService } from './charge-category-resolver.service';
import { ChargeCategoryService } from './charge-category.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ChargeCategoryModel } from './models/charge-category.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';

describe('ChargeCategoryResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ChargeCategoryResolverService, ChargeCategoryService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const incomeSourceTypeService = TestBed.get(ChargeCategoryService);
    const expectedResult: Observable<ChargeCategoryModel> = Observable.of({ id: 42, name: 'rental' });

    spyOn(incomeSourceTypeService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.get(ChargeCategoryResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(incomeSourceTypeService.get).toHaveBeenCalledWith(42);
  });
});
