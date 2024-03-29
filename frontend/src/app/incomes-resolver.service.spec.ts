import { TestBed } from '@angular/core/testing';

import { IncomesResolverService } from './incomes-resolver.service';
import { IncomeService } from './income.service';
import { HttpClientModule } from '@angular/common/http';
import { IncomeModel } from './models/income.model';
import { of } from 'rxjs';
import { CurrentPersonService } from './current-person.service';
import { PersonModel } from './models/person.model';

describe('IncomesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 } as PersonModel);
  });

  it('should retrieve the incomes of the person stored in the data of the parent route', () => {
    const incomeService = TestBed.inject(IncomeService);
    const expectedResults = of([{ id: 23 }] as Array<IncomeModel>);

    spyOn(incomeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.inject(IncomesResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResults);
    expect(incomeService.list).toHaveBeenCalledWith(42);
  });
});
