import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IncomeTypesResolverService } from './income-types-resolver.service';
import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceTypeService } from './income-source-type.service';

describe('IncomeTypesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IncomeTypesResolverService, IncomeSourceTypeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
    const expectedResults: Observable<Array<IncomeSourceTypeModel>> = Observable.of([{ id: 42, type: 'CAF' }]);

    spyOn(incomeSourceTypeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.get(IncomeTypesResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResults);
    expect(incomeSourceTypeService.list).toHaveBeenCalled();
  });
});
