import { TestBed } from '@angular/core/testing';

import { ChargeTypesResolverService } from './charge-types-resolver.service';
import { ChargeTypeService } from './charge-type.service';
import { HttpClientModule } from '@angular/common/http';
import { ChargeTypeModel } from './models/charge-type.model';
import { of } from 'rxjs';

describe('ChargeTypesResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve a type', () => {
    const chargeTypeService = TestBed.inject(ChargeTypeService);
    const expectedResults = of([{ id: 42, name: 'mortgage' } as ChargeTypeModel]);

    spyOn(chargeTypeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.inject(ChargeTypesResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResults);
    expect(chargeTypeService.list).toHaveBeenCalled();
  });
});
