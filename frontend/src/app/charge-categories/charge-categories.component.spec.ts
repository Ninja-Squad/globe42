import { TestBed } from '@angular/core/testing';

import { ChargeCategoriesComponent } from './charge-categories.component';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { PageTitleDirective } from '../page-title.directive';

describe('ChargeCategoriesComponent', () => {
  const chargeCategories: Array<ChargeCategoryModel> = [{ id: 42, name: 'rental' }];
  const activatedRoute = {
    snapshot: { data: { chargeCategories } }
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ChargeCategoriesComponent, PageTitleDirective],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })
  );

  it('should list categories', () => {
    const fixture = TestBed.createComponent(ChargeCategoriesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const types = nativeElement.querySelectorAll('div.charge-category-item');
    expect(types.length).toBe(1);
  });
});
