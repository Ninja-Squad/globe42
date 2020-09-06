import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { IncomeTypesComponent } from './income-types.component';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class IncomeTypesComponentTester extends ComponentTester<IncomeTypesComponent> {
  constructor() {
    super(IncomeTypesComponent);
  }

  get incomeTypes() {
    return this.elements('.income-type-item');
  }
}

describe('IncomeTypesComponent', () => {
  let tester: IncomeTypesComponentTester;

  beforeEach(() => {
    const incomeTypes: Array<IncomeSourceTypeModel> = [{ id: 42, type: 'CAF' }];
    const activatedRoute = {
      snapshot: { data: { incomeTypes } }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [IncomeTypesComponent, PageTitleDirective],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });

    tester = new IncomeTypesComponentTester();
    tester.detectChanges();
  });

  it('should list types', () => {
    expect(tester.incomeTypes.length).toBe(1);
  });
});
