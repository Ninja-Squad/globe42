import { async, TestBed } from '@angular/core/testing';

import { IncomeSourcesComponent } from './income-sources.component';
import { AppModule } from '../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { IncomeSourceModel } from '../models/income-source.model';

describe('IncomeSourcesComponent', () => {
  const incomeSources: Array<IncomeSourceModel> = [
    {
      id: 12,
      name: 'Allocations familiales',
      type: { id: 42, type: 'CAF' },
      maxMonthlyAmount: 789.01
    },
    {
      id: 13,
      name: 'Salaire',
      type: { id: 43, type: 'travail' },
      maxMonthlyAmount: null
    }];

  const activatedRoute = {
    snapshot: { data: { incomeSources } }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  })));

  it('should list income sources', () => {
    const fixture = TestBed.createComponent(IncomeSourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const sources = nativeElement.querySelectorAll('div.income-source-item');
    expect(sources.length).toBe(2);

    const source1 = sources[0];
    expect(source1.textContent).toContain('Allocations familiales');
    expect(source1.textContent).toContain('CAF');
    expect(source1.textContent).toContain('max. 789,01 € / mois');

    const source2 = sources[1];
    expect(source2.textContent).not.toContain('max.');
  });
});
