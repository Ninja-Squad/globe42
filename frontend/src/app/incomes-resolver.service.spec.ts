import { TestBed } from '@angular/core/testing';

import { IncomesResolverService } from './incomes-resolver.service';
import { IncomeService } from './income.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IncomeModel } from './models/income.model';

describe('IncomesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IncomesResolverService, IncomeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve the incomes of the person stored in the data of the parent route', () => {
    const incomeService = TestBed.get(IncomeService);
    const expectedResults: Observable<Array<IncomeModel>> = Observable.of([{ id: 23 }]);

    spyOn(incomeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.get(IncomesResolverService);
    const route = {
      parent: {
        data: {
          person: { id: 42 }
        }
      }
    };
    const result = resolver.resolve(route);

    expect(result).toBe(expectedResults);
    expect(incomeService.list).toHaveBeenCalledWith(42);
  });
});
