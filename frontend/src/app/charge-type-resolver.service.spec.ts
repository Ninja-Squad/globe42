import { TestBed } from '@angular/core/testing';

import { ChargeTypeResolverService } from './charge-type-resolver.service';
import { Observable, of } from 'rxjs';
import { ChargeTypeModel } from './models/charge-type.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChargeTypeService } from './charge-type.service';

describe('ChargeTypeResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve a type', () => {
    const chargeTypeService = TestBed.inject(ChargeTypeService);
    const expectedResult: Observable<ChargeTypeModel> = of({
      id: 42,
      name: 'Mortgage'
    } as ChargeTypeModel);

    spyOn(chargeTypeService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.inject(ChargeTypeResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(chargeTypeService.get).toHaveBeenCalledWith(42);
  });
});
