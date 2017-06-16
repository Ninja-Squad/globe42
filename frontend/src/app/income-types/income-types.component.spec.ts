import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { IncomeTypesComponent } from './income-types.component';
import { AppModule } from '../app.module';
import { IncomeTypeModel } from '../models/income.model';

describe('IncomeTypesComponent', () => {
  const incomeTypes: Array<IncomeTypeModel> = [{ id: 42, type: 'CAF' }];
  const activatedRoute = {
    snapshot: { data: { incomeTypes } }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should list types', () => {
    const fixture = TestBed.createComponent(IncomeTypesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const types = nativeElement.querySelectorAll('div.list-group-item');
    expect(types.length).toBe(1);
  });
});
