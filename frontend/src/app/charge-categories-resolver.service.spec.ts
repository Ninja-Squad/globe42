import { TestBed } from '@angular/core/testing';

import { ChargeCategoriesResolverService } from './charge-categories-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { ChargeCategoryService } from './charge-category.service';
import { Observable } from 'rxjs/Observable';
import { ChargeCategoryModel } from './models/charge-category.model';
import { of } from 'rxjs/observable/of';

describe('ChargeCategoriesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ChargeCategoriesResolverService, ChargeCategoryService],
    imports: [HttpClientModule]
  }));

  it('should retrieve a category', () => {
    const chargeCategoryService = TestBed.get(ChargeCategoryService);
    const expectedResults: Observable<Array<ChargeCategoryModel>> = of([{ id: 42, name: 'rental' }]);

    spyOn(chargeCategoryService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.get(ChargeCategoriesResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResults);
    expect(chargeCategoryService.list).toHaveBeenCalled();
  });
});
