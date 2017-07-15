import { TestBed } from '@angular/core/testing';

import { IncomeSourcesComponent } from './income-sources.component';
import { IncomeSourceModel } from '../models/income.model';
import { AppModule } from '../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('IncomeSourcesComponent', () => {
  const incomeSources: Array<IncomeSourceModel> = [{
    id: 12,
    name: 'Allocations familiales',
    type: { id: 42, type: 'CAF' },
    maxMonthlyAmount: 789.01
  }];

  const activatedRoute = {
    snapshot: { data: { incomeSources } }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should list income sources', () => {
    const fixture = TestBed.createComponent(IncomeSourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const sources = nativeElement.querySelectorAll('div.income-source-item');
    expect(sources.length).toBe(1);

    const source = sources[0];
    expect(source.textContent).toContain('Allocations familiales');
    expect(source.textContent).toContain('CAF');
    expect(source.textContent).toContain('max. 789,01 € / mois');
  });
});
