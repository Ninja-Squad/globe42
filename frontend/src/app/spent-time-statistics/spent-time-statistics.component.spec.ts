import { SpentTimeStatisticsComponent } from './spent-time-statistics.component';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { TaskService } from '../task.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartComponent } from '../chart/chart.component';
import { DurationPipe } from '../duration.pipe';
import { HttpClientModule } from '@angular/common/http';
import { SpentTimeStatisticsModel } from '../models/spent-time-statistics.model';
import { UserModel } from '../models/user.model';
import { By } from '@angular/platform-browser';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { CurrentUserModule } from '../current-user/current-user.module';
import { EMPTY, of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class SpentTimeStatisticsComponentTester extends ComponentTester<SpentTimeStatisticsComponent> {
  constructor() {
    super(SpentTimeStatisticsComponent);
  }

  get from() {
    return this.input('#from');
  }

  get to() {
    return this.input('#to');
  }

  get by() {
    return this.select('#by');
  }

  get tableRows() {
    return this.elements('table tbody tr');
  }

  get chart(): ChartComponent {
    return this.debugElement.query(By.directive(ChartComponent)).componentInstance;
  }
}

function createRoute(queryParams: { [key: string]: string }): ActivatedRoute {
  return {
    snapshot: {
      data: {
        users: [
          { id: 1, login: 'jb' },
          { id: 2, login: 'ced' }
        ]
      },
      queryParamMap: convertToParamMap(queryParams)
    }
  } as any;
}

describe('SpentTimeStatisticsComponent', () => {
  let route: ActivatedRoute;
  let tester: SpentTimeStatisticsComponentTester;

  beforeEach(() => {
    jasmine.clock().mockDate(DateTime.fromISO('2017-12-29T12:13:00Z').toJSDate());

    TestBed.overrideTemplate(ChartComponent, '');
    TestBed.configureTestingModule({
      declarations: [
        SpentTimeStatisticsComponent,
        ChartComponent,
        DurationPipe,
        PageTitleDirective
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'tasks/statistics',
            component: SpentTimeStatisticsComponent
          }
        ]),
        ReactiveFormsModule,
        GlobeNgbTestingModule,
        CurrentUserModule.forRoot(),
        HttpClientModule
      ],
      providers: [{ provide: ActivatedRoute, useFactory: () => route }]
    });

    const taskService = TestBed.inject(TaskService);
    spyOn(taskService, 'spentTimeStatistics').and.returnValue(EMPTY);
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should create form with current month and all users selected', () => {
    route = createRoute({});
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    tester = new SpentTimeStatisticsComponentTester();
    tester.detectChanges();

    expect(tester.componentInstance.criteriaForm.value).toEqual({
      from: '2017-12-01',
      to: '2017-12-31',
      by: 0
    });

    expect(router.navigate).toHaveBeenCalledWith(['tasks/statistics'], {
      queryParams: tester.componentInstance.criteriaForm.value,
      replaceUrl: true
    });
  });

  it('should create form based on query params', () => {
    route = createRoute({
      from: '2017-11-01',
      to: '2017-11-31',
      by: '1'
    });

    tester = new SpentTimeStatisticsComponentTester();
    tester.detectChanges();

    expect(tester.componentInstance.criteriaForm.value).toEqual({
      from: '2017-11-01',
      to: '2017-11-31',
      by: 1
    });
  });

  it('should load statistics', () => {
    route = createRoute({});
    const taskService = TestBed.inject(TaskService);
    const statisticsModel: SpentTimeStatisticsModel = {
      statistics: []
    };
    (taskService.spentTimeStatistics as jasmine.Spy).and.returnValue(of(statisticsModel));

    tester = new SpentTimeStatisticsComponentTester();
    tester.detectChanges();

    expect(tester.componentInstance.statisticsModel).toEqual(statisticsModel);
    expect(taskService.spentTimeStatistics).toHaveBeenCalledWith({
      from: '2017-12-01',
      to: '2017-12-31'
    });
  });

  it('should initialize category statistics and chart configuration when all users selected', () => {
    route = createRoute({});
    const taskService = TestBed.inject(TaskService);
    const statisticsModel: SpentTimeStatisticsModel = {
      statistics: [
        {
          user: { id: 1 } as UserModel,
          category: { id: 6, name: 'Meal' },
          minutes: 10
        },
        {
          user: { id: 2 } as UserModel,
          category: { id: 6, name: 'Meal' },
          minutes: 20
        },
        {
          user: { id: 1 } as UserModel,
          category: { id: 7, name: 'Administration' },
          minutes: 30
        },
        {
          user: { id: 2 } as UserModel,
          category: { id: 7, name: 'Administration' },
          minutes: 40
        }
      ]
    };
    (taskService.spentTimeStatistics as jasmine.Spy).and.returnValue(of(statisticsModel));

    tester = new SpentTimeStatisticsComponentTester();
    tester.detectChanges();

    expect(tester.componentInstance.categoryStatistics).toEqual([
      {
        category: { id: 7, name: 'Administration' },
        minutes: 70
      },
      {
        category: { id: 6, name: 'Meal' },
        minutes: 30
      }
    ]);

    expect(tester.componentInstance.chartConfiguration.data.labels).toEqual([
      'Administration',
      'Meal'
    ]);
    expect(tester.componentInstance.chartConfiguration.data.datasets[0].data).toEqual([70, 30]);
    expect(
      (
        tester.componentInstance.chartConfiguration.data.datasets[0]
          .backgroundColor as Array<string>
      ).length
    ).toBe(2);
  });

  it('should reinitialize category statistics and chart configuration when user selection changes', () => {
    route = createRoute({});
    const taskService = TestBed.inject(TaskService);
    const statisticsModel: SpentTimeStatisticsModel = {
      statistics: [
        {
          user: { id: 1 } as UserModel,
          category: { id: 6, name: 'Meal' },
          minutes: 10
        },
        {
          user: { id: 2 } as UserModel,
          category: { id: 6, name: 'Meal' },
          minutes: 20
        },
        {
          user: { id: 1 } as UserModel,
          category: { id: 7, name: 'Administration' },
          minutes: 30
        },
        {
          user: { id: 2 } as UserModel,
          category: { id: 7, name: 'Administration' },
          minutes: 40
        }
      ]
    };
    (taskService.spentTimeStatistics as jasmine.Spy).and.returnValue(of(statisticsModel));

    tester = new SpentTimeStatisticsComponentTester();
    tester.detectChanges();

    tester.componentInstance.criteriaForm.patchValue({ by: 1 });
    tester.detectChanges();

    expect(tester.componentInstance.categoryStatistics).toEqual([
      {
        category: { id: 7, name: 'Administration' },
        minutes: 30
      },
      {
        category: { id: 6, name: 'Meal' },
        minutes: 10
      }
    ]);

    expect(tester.componentInstance.chartConfiguration.data.labels).toEqual([
      'Administration',
      'Meal'
    ]);
    expect(tester.componentInstance.chartConfiguration.data.datasets[0].data).toEqual([30, 10]);
  });

  it('should reload statistics and reset chart configuration when date changes', () => {
    route = createRoute({});
    const taskService = TestBed.inject(TaskService);
    const statisticsModel1: SpentTimeStatisticsModel = {
      statistics: []
    };
    const statisticsModel2: SpentTimeStatisticsModel = {
      statistics: [
        {
          user: { id: 1 } as UserModel,
          category: { id: 6, name: 'Meal' },
          minutes: 10
        },
        {
          user: { id: 2 } as UserModel,
          category: { id: 6, name: 'Meal' },
          minutes: 20
        }
      ]
    };

    (taskService.spentTimeStatistics as jasmine.Spy).and.returnValues(
      of(statisticsModel1),
      of(statisticsModel2)
    );

    tester = new SpentTimeStatisticsComponentTester();
    tester.detectChanges();

    tester.componentInstance.criteriaForm.patchValue({ to: '2018-01-01' });

    tester.detectChanges();

    expect(tester.componentInstance.categoryStatistics).toEqual([
      {
        category: { id: 6, name: 'Meal' },
        minutes: 30
      }
    ]);

    expect(tester.componentInstance.chartConfiguration.data.labels).toEqual(['Meal']);
    expect(tester.componentInstance.chartConfiguration.data.datasets[0].data).toEqual([30]);
  });

  it('should have a view', () => {
    route = createRoute({});
    const taskService = TestBed.inject(TaskService);
    const statisticsModel: SpentTimeStatisticsModel = {
      statistics: [
        {
          user: { id: 1 } as UserModel,
          category: { id: 6, name: 'Meal' },
          minutes: 10
        },
        {
          user: { id: 1 } as UserModel,
          category: { id: 7, name: 'Administration' },
          minutes: 30
        }
      ]
    };
    (taskService.spentTimeStatistics as jasmine.Spy).and.returnValue(of(statisticsModel));

    tester = new SpentTimeStatisticsComponentTester();
    tester.detectChanges();

    expect(tester.from).toHaveValue('01/12/2017');
    expect(tester.to).toHaveValue('31/12/2017');
    expect(tester.by).toHaveSelectedLabel('Tous les utilisateurs');
    expect(tester.by.optionLabels[1]).toBe('ced');
    expect(tester.by.optionLabels[2]).toBe('jb');

    expect(tester.tableRows[0]).toContainText('Administration');
    expect(tester.tableRows[0]).toContainText('0h30m');
    expect(tester.tableRows[1]).toContainText('Meal');
    expect(tester.tableRows[1]).toContainText('0h10m');

    expect(tester.chart.configuration).toBe(tester.componentInstance.chartConfiguration);
  });
});
