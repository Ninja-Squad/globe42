import { TestBed } from '@angular/core/testing';

import { ChargesResolverService } from './charges-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { ChargeService } from './charge.service';
import { ChargeModel } from './models/charge.model';
import { of } from 'rxjs';
import { CurrentPersonService } from './current-person.service';

describe('ChargesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 });
  });

  it('should retrieve the charges of the person stored in the data of the parent route', () => {
    const chargeService = TestBed.inject(ChargeService);
    const expectedResults = of([{ id: 23 }] as Array<ChargeModel>);

    spyOn(chargeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.inject(ChargesResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResults);
    expect(chargeService.list).toHaveBeenCalledWith(42);
  });
});
