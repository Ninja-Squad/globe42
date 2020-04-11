import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { IncomeTypesComponent } from './income-types.component';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { PageTitleDirective } from '../page-title.directive';

describe('IncomeTypesComponent', () => {
  const incomeTypes: Array<IncomeSourceTypeModel> = [{ id: 42, type: 'CAF' }];
  const activatedRoute = {
    snapshot: { data: { incomeTypes } }
  };

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [IncomeTypesComponent, PageTitleDirective],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

  it('should list types', () => {
    const fixture = TestBed.createComponent(IncomeTypesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const types = nativeElement.querySelectorAll('div.income-type-item');
    expect(types.length).toBe(1);
  });
});
