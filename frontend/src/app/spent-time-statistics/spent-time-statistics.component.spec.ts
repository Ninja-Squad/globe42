import { SpentTimeStatisticsComponent } from './spent-time-statistics.component';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { NowService } from '../now.service';
import { DateTime } from 'luxon';
import { TaskService } from '../task.service';
import { ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/observable/of';
import { ChartComponent } from '../chart/chart.component';
import { DurationPipe } from '../duration.pipe';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SpentTimeStatisticsModel } from '../models/spent-time-statistics.model';
import 'rxjs/add/observable/empty';
import { UserModel } from '../models/user.model';
import { ChartColor } from 'chart.js';
import { By } from '@angular/platform-browser';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { CurrentUserModule } from '../current-user/current-user.module';

class FakeNowService extends NowService {
  now(): DateTime {
    return DateTime.fromISO('2017-12-29T12:13:00Z');
  }
}

function createRoute(queryParams: {[key: string]: string}): ActivatedRoute {
  return {
    snapshot: {
      data: {
        users: [ { id: 1, login: 'jb' }, { id: 2, login: 'ced' } ]
      },
      queryParamMap: convertToParamMap(queryParams)
    }
  } as any;
}

describe('SpentTimeStatisticsComponent', () => {

  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.overrideTemplate(ChartComponent, '');
    TestBed.configureTestingModule({
      declarations: [SpentTimeStatisticsComponent, ChartComponent, DurationPipe],
      imports: [RouterTestingModule.withRoutes([
        {
          path: 'tasks/statistics', component: SpentTimeStatisticsComponent
        }
      ]), ReactiveFormsModule, GlobeNgbModule.forRoot(), CurrentUserModule.forRoot(), HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useFactory: () => route },
        { provide: NowService, useClass: FakeNowService },
        TaskService
      ]
    });

    const taskService = TestBed.get(TaskService);
    spyOn(taskService, 'spentTimeStatistics').and.returnValue(Observable.empty());
  });

  it('should create form with current month and all users selected', () => {
    route = createRoute({});
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const fixture = TestBed.createComponent(SpentTimeStatisticsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.criteriaForm.value).toEqual({
      from: '2017-12-01',
      to: '2017-12-31',
      by: 0
    });

    expect(router.navigate).toHaveBeenCalledWith(['tasks/statistics'], { queryParams: component.criteriaForm.value, replaceUrl: true });
  });

  it('should create form based on query params', () => {
    route = createRoute({
      from: '2017-11-01',
      to: '2017-11-31',
      by: '1'
    });

    const fixture = TestBed.createComponent(SpentTimeStatisticsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.criteriaForm.value).toEqual({
      from: '2017-11-01',
      to: '2017-11-31',
      by: 1
    });
  });

  it('should load statistics', () => {
    route = createRoute({});
    const taskService = TestBed.get(TaskService);
    const statisticsModel: SpentTimeStatisticsModel = {
      statistics: []
    };
    taskService.spentTimeStatistics.and.returnValue(Observable.of(statisticsModel));

    const fixture = TestBed.createComponent(SpentTimeStatisticsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.statisticsModel).toEqual(statisticsModel);
    expect(taskService.spentTimeStatistics).toHaveBeenCalledWith({ from: '2017-12-01', to: '2017-12-31' });
  });

  it('should initialize category statistics and chart configuration when all users selected', () => {
    route = createRoute({});
    const taskService = TestBed.get(TaskService);
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
    taskService.spentTimeStatistics.and.returnValue(Observable.of(statisticsModel));

    const fixture = TestBed.createComponent(SpentTimeStatisticsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.categoryStatistics).toEqual([
      {
        category: { id: 7, name: 'Administration' },
        minutes: 70
      },
      {
        category: { id: 6, name: 'Meal' },
        minutes: 30
      }
    ]);

    expect(component.chartConfiguration.data.labels).toEqual([ 'Administration', 'Meal' ]);
    expect(component.chartConfiguration.data.datasets[0].data).toEqual([ 70, 30 ]);
    expect((component.chartConfiguration.data.datasets[0].backgroundColor as Array<ChartColor>).length).toBe(2);
  });

  it('should reinitialize category statistics and chart configuration when user selection changes', () => {
    route = createRoute({});
    const taskService = TestBed.get(TaskService);
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
    taskService.spentTimeStatistics.and.returnValue(Observable.of(statisticsModel));

    const fixture = TestBed.createComponent(SpentTimeStatisticsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.criteriaForm.patchValue({ by: 1 });
    fixture.detectChanges();

    expect(component.categoryStatistics).toEqual([
      {
        category: { id: 7, name: 'Administration' },
        minutes: 30
      },
      {
        category: { id: 6, name: 'Meal' },
        minutes: 10
      }
    ]);

    expect(component.chartConfiguration.data.labels).toEqual([ 'Administration', 'Meal' ]);
    expect(component.chartConfiguration.data.datasets[0].data).toEqual([ 30, 10 ]);
  });

  it('should reload statistics and reset chart configuration when date changes', () => {
    route = createRoute({});
    const taskService = TestBed.get(TaskService);
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

    taskService.spentTimeStatistics.and.returnValues(Observable.of(statisticsModel1), Observable.of(statisticsModel2));

    const fixture = TestBed.createComponent(SpentTimeStatisticsComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.criteriaForm.patchValue({ to: '2018-01-01' });

    fixture.detectChanges();

    expect(component.categoryStatistics).toEqual([
      {
        category: { id: 6, name: 'Meal' },
        minutes: 30
      }
    ]);

    expect(component.chartConfiguration.data.labels).toEqual([ 'Meal' ]);
    expect(component.chartConfiguration.data.datasets[0].data).toEqual([ 30 ]);
  });

  it('should have a view', () => {
    route = createRoute({});
    const taskService = TestBed.get(TaskService);
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
    taskService.spentTimeStatistics.and.returnValue(Observable.of(statisticsModel));

    const fixture = TestBed.createComponent(SpentTimeStatisticsComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#from').value).toBe('01/12/2017');
    expect(fixture.nativeElement.querySelector('#to').value).toBe('31/12/2017');
    const bySelect: HTMLSelectElement = fixture.nativeElement.querySelector('#by');
    expect(bySelect.selectedIndex).toBe(0);
    expect(bySelect.selectedOptions.item(0).textContent).toBe('Tous les utilisateurs');
    expect(bySelect.options.item(1).textContent).toBe('ced');
    expect(bySelect.options.item(2).textContent).toBe('jb');

    const table: HTMLTableElement = fixture.nativeElement.querySelector('table');
    expect(table.rows.item(1).textContent).toContain('Administration');
    expect(table.rows.item(1).textContent).toContain('0h30m');
    expect(table.rows.item(2).textContent).toContain('Meal');
    expect(table.rows.item(2).textContent).toContain('0h10m');


    const chart: ChartComponent = fixture.debugElement.query(By.directive(ChartComponent)).componentInstance;
    expect(chart.configuration).toBe(fixture.componentInstance.chartConfiguration);
  });
});
