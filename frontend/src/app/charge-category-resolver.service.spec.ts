import { TestBed } from '@angular/core/testing';
import { ChargeCategoryResolverService } from './charge-category-resolver.service';
import { ChargeCategoryService } from './charge-category.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ChargeCategoryModel } from './models/charge-category.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';

describe('ChargeCategoryResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve a type', () => {
    const chargeCategoryService = TestBed.inject(ChargeCategoryService);
    const expectedResult: Observable<ChargeCategoryModel> = of({ id: 42, name: 'rental' });

    spyOn(chargeCategoryService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.inject(ChargeCategoryResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(chargeCategoryService.get).toHaveBeenCalledWith(42);
  });
});
