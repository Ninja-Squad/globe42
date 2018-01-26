import { TestBed } from '@angular/core/testing';

import { ChargeTypeResolverService } from './charge-type-resolver.service';
import { Observable } from 'rxjs/Observable';
import { ChargeTypeModel } from './models/charge-type.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChargeTypeService } from './charge-type.service';
import { of } from 'rxjs/observable/of';

describe('ChargeTypeResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ChargeTypeResolverService, ChargeTypeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const chargeTypeService = TestBed.get(ChargeTypeService);
    const expectedResult: Observable<ChargeTypeModel> = of({ id: 42, name: 'Mortgage' } as ChargeTypeModel);

    spyOn(chargeTypeService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.get(ChargeTypeResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(chargeTypeService.get).toHaveBeenCalledWith(42);
  });
});
