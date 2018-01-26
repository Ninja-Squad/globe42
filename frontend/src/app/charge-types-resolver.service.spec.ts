import { TestBed } from '@angular/core/testing';

import { ChargeTypesResolverService } from './charge-types-resolver.service';
import { ChargeTypeService } from './charge-type.service';
import { HttpClientModule } from '@angular/common/http';
import { ChargeTypeModel } from './models/charge-type.model';
import { of } from 'rxjs/observable/of';

describe('ChargeTypesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ChargeTypesResolverService, ChargeTypeService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a type', () => {
    const chargeTypeService = TestBed.get(ChargeTypeService);
    const expectedResults = of([{ id: 42, name: 'mortgage' } as ChargeTypeModel]);

    spyOn(chargeTypeService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.get(ChargeTypesResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResults);
    expect(chargeTypeService.list).toHaveBeenCalled();
  });
});
