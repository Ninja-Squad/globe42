import { TestBed } from '@angular/core/testing';

import { ChargesResolverService } from './charges-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { ChargeService } from './charge.service';
import { ChargeModel } from './models/charge.model';
import { of } from 'rxjs';

describe('ChargesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should retrieve the charges of the person stored in the data of the parent route', () => {
    const chargeService = TestBed.get(ChargeService);
    const expectedResults = of([{ id: 23 }] as Array<ChargeModel>);

    spyOn(chargeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.get(ChargesResolverService);
    const route = {
      parent: {
        data: {
          person: { id: 42 }
        }
      }
    };
    const result = resolver.resolve(route);

    expect(result).toBe(expectedResults);
    expect(chargeService.list).toHaveBeenCalledWith(42);
  });
});
