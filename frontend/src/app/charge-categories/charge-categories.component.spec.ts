import { TestBed } from '@angular/core/testing';

import { ChargeCategoriesComponent } from './charge-categories.component';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class ChargeCategoriesComponentTester extends ComponentTester<ChargeCategoriesComponent> {
  constructor() {
    super(ChargeCategoriesComponent);
  }

  get categories() {
    return this.elements('.charge-category-item');
  }
}

describe('ChargeCategoriesComponent', () => {
  let tester: ChargeCategoriesComponentTester;

  beforeEach(() => {
    const chargeCategories: Array<ChargeCategoryModel> = [{ id: 42, name: 'rental' }];
    const activatedRoute = {
      snapshot: { data: { chargeCategories } }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ChargeCategoriesComponent, PageTitleDirective],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });

    tester = new ChargeCategoriesComponentTester();
    tester.detectChanges();
  });

  it('should list categories', () => {
    expect(tester.categories.length).toBe(1);
  });
});
