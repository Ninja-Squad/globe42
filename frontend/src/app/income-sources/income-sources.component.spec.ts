import { TestBed } from '@angular/core/testing';

import { IncomeSourcesComponent } from './income-sources.component';
import { ActivatedRoute } from '@angular/router';
import { IncomeSourceModel } from '../models/income-source.model';
import { RouterTestingModule } from '@angular/router/testing';
import { LOCALE_ID } from '@angular/core';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class IncomeSourcesComponentTester extends ComponentTester<IncomeSourcesComponent> {
  constructor() {
    super(IncomeSourcesComponent);
  }

  get incomeSources() {
    return this.elements('.income-source-item');
  }
}

describe('IncomeSourcesComponent', () => {
  let tester: IncomeSourcesComponentTester;

  beforeEach(() => {
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
      }
    ];

    const activatedRoute = {
      snapshot: { data: { incomeSources } }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [IncomeSourcesComponent, PageTitleDirective],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ]
    });

    tester = new IncomeSourcesComponentTester();
    tester.detectChanges();
  });

  it('should list income sources', () => {
    expect(tester.incomeSources.length).toBe(2);

    const source1 = tester.incomeSources[0];
    expect(source1).toContainText('Allocations familiales');
    expect(source1).toContainText('CAF');
    expect(source1).toContainText('max. 789,01 € / mois');

    const source2 = tester.incomeSources[1];
    expect(source2).not.toContainText('max.');
  });
});
