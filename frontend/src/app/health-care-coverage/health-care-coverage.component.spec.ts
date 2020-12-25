import { TestBed } from '@angular/core/testing';

import { HealthCareCoverageComponent } from './health-care-coverage.component';
import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { ChartComponent } from '../chart/chart.component';
import { By } from '@angular/platform-browser';
import { DisplayHealthCareCoveragePipe } from '../display-health-care-coverage.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HealthCareCoverageModel } from '../models/health-care-coverage.model';

class HealthCareCoverageComponentTester extends ComponentTester<HealthCareCoverageComponent> {
  constructor() {
    super(HealthCareCoverageComponent);
  }

  get chart(): ChartComponent {
    return this.debugElement.query(By.directive(ChartComponent)).componentInstance;
  }

  get tableRows() {
    return this.elements('table tbody tr');
  }

  get totalRow() {
    return this.elements('table tfoot tr')[0];
  }

  get totalCoveredRow() {
    return this.elements('table tfoot tr')[1];
  }
}

describe('HealthcareCoverageComponent', () => {
  let tester: HealthCareCoverageComponentTester;

  beforeEach(() => {
    const coverage: HealthCareCoverageModel = {
      entries: [
        {
          coverage: 'UNKNOWN',
          count: 10
        },
        {
          coverage: 'NONE',
          count: 5
        },
        {
          coverage: 'GENERAL',
          count: 17
        },
        {
          coverage: 'OTHER',
          count: 11
        }
      ]
    };
    const route = fakeRoute({
      snapshot: fakeSnapshot({
        data: {
          coverage
        }
      })
    });

    TestBed.configureTestingModule({
      declarations: [HealthCareCoverageComponent, DisplayHealthCareCoveragePipe, ChartComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: route }]
    });

    tester = new HealthCareCoverageComponentTester();
    tester.detectChanges();
  });

  it('should display a chart', () => {
    expect(tester.chart).not.toBeNull();
    expect(tester.chart.configuration.data.labels).toEqual([
      'Inconnue',
      'Aucune',
      'Régime général',
      'Autre'
    ]);
    expect(tester.chart.configuration.data.datasets[0].data).toEqual([10, 5, 17, 11]);
    expect(
      (tester.chart.configuration.data.datasets[0].backgroundColor as Array<string>).length
    ).toBe(4);
  });

  it('should display the entries', () => {
    expect(tester.tableRows.length).toBe(4);
    expect(tester.tableRows[1]).toContainText('Aucune');
    expect(tester.tableRows[1]).toContainText('5');

    expect(tester.totalRow).toContainText('43');
    expect(tester.totalCoveredRow).toContainText('28');
  });
});
