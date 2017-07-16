import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IncomeTypeResolverService } from './income-type-resolver.service';
import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceTypeService } from './income-source-type.service';

describe('IncomeTypeResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IncomeTypeResolverService, IncomeSourceTypeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
    const expectedResult: Observable<IncomeSourceTypeModel> = Observable.of({ id: 42, type: 'CAF' });

    spyOn(incomeSourceTypeService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.get(IncomeTypeResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(incomeSourceTypeService.get).toHaveBeenCalledWith(42);
  });
});
