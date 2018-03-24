import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IncomeTypesResolverService } from './income-types-resolver.service';
import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceTypeService } from './income-source-type.service';

describe('IncomeTypesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
    const expectedResults: Observable<Array<IncomeSourceTypeModel>> = of([{ id: 42, type: 'CAF' }]);

    spyOn(incomeSourceTypeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.get(IncomeTypesResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResults);
    expect(incomeSourceTypeService.list).toHaveBeenCalled();
  });
});
