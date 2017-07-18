import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonIncomesComponent } from './person-incomes.component';
import { IncomeModel } from '../models/income.model';
import { AppModule } from '../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('PersonIncomesComponent', () => {
  const incomes: Array<IncomeModel> = [
    {
      id: 12,
      source: { name: 'Allocations familiales'},
      monthlyAmount: 789.01
    },
    {
      id: 13,
      source: { name: 'Salaire' },
      monthlyAmount: 500
    }
  ] as Array<IncomeModel>;

  const activatedRoute = {
    snapshot: { data: { incomes } }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  })));

  it('should list incomes', () => {
    const fixture = TestBed.createComponent(PersonIncomesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const sources = nativeElement.querySelectorAll('div.income-item');
    expect(sources.length).toBe(2);

    const source1 = sources[0];
    expect(source1.textContent).toContain('Allocations familiales');
    expect(source1.textContent).toContain('789,01 € / mois');
  });
});
