import { Component, OnInit } from '@angular/core';
import { TaskCategoryModel } from '../models/task-category.model';
import { TaskService } from '../task.service';
import { ChartConfiguration } from 'chart.js';
import { minutesToDuration, sortBy } from '../utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NowService } from '../now.service';
import { UserModel } from '../models/user.model';
import { SpentTimeStatisticsModel } from '../models/spent-time-statistics.model';
import { of } from 'rxjs/observable/of';
import { catchError, concat, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

export interface CategoryStatistic {
  category: TaskCategoryModel;
  minutes: number;
}

const COLORS = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#0082c8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#d2f53c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#aa6e28',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000080',
  '#808080'
];

const ALL_USERS = 0;

@Component({
  selector: 'gl-spent-time-statistics',
  templateUrl: './spent-time-statistics.component.html',
  styleUrls: ['./spent-time-statistics.component.scss']
})
export class SpentTimeStatisticsComponent implements OnInit {

  criteriaForm: FormGroup;

  statisticsModel: SpentTimeStatisticsModel;
  chartConfiguration: ChartConfiguration;
  categoryStatistics: Array<CategoryStatistic>;

  users: Array<UserModel>;

  constructor(fb: FormBuilder,
              private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute,
              private nowService: NowService) {
    this.criteriaForm = fb.group({
      from: null as string,
      to: null as string,
      by: ALL_USERS,
    });
  }

  ngOnInit() {
    this.users = sortBy(this.route.snapshot.data['users'], user => user.login);

    // If no param, default to the current month
    const paramMap = this.route.snapshot.queryParamMap;
    if (!paramMap.get('from') && !paramMap.get('to') && !paramMap.get('by')) {
      this.criteriaForm.setValue( {
        from: this.nowService.now().startOf('month').toISODate(),
        to: this.nowService.now().endOf('month').toISODate(),
        by: ALL_USERS
      });
    } else {
      this.criteriaForm.setValue( {
        from: paramMap.get('from'),
        to: paramMap.get('to'),
        by: +paramMap.get('by')
      });
    }

    // when criteria change, we update the URL
    // when from or to changes, we reload the statistics
    of(this.criteriaForm.value).pipe(
      concat(this.criteriaForm.valueChanges)
    ).pipe(
      filter(() => this.criteriaForm.valid),
      tap(value => this.router.navigate(['tasks/statistics'], { queryParams: value, replaceUrl: true })),
      map(value => ({ from: value.from, to: value.to })),
      distinctUntilChanged((v1, v2) => v1.from === v2.from && v1.to === v2.to),
      switchMap(value => this.taskService.spentTimeStatistics(value)
        .pipe(catchError(() => empty<SpentTimeStatisticsModel>())))
    ).subscribe(stats => this.updateState(stats));

    // when by changes, no need to reload the statistics, but the chart must be updated
    // note: using the valueChanges on the "by" form control doesn't change because the event is emitted before
    // the value of the form group is updated
    this.criteriaForm.valueChanges.pipe(
      map(value => value.by),
      distinctUntilChanged()
    ).subscribe(() => this.updateState(this.statisticsModel));
  }

  private updateState(statisticsModel: SpentTimeStatisticsModel) {
    this.statisticsModel = statisticsModel;
    this.categoryStatistics = this.createCategoryStatistics();
    this.chartConfiguration = this.createChartConfiguration();
  }

  private createChartConfiguration(): ChartConfiguration {
    const labels: Array<string> = [];
    const data: Array<number> = [];
    const backgroundColor: Array<string> = [];

    this.categoryStatistics.forEach((value, index) => {
      labels.push(value.category.name);
      data.push(value.minutes);
      backgroundColor.push(COLORS[index % COLORS.length]);
    });

    return {
      type: 'doughnut',
      data: {labels, datasets: [{data, backgroundColor}]},
      options: {
        cutoutPercentage: 70,
        tooltips: {
          callbacks: {
            label: (tooltipItem, chart) => {
              const categoryName = chart.labels[tooltipItem.index];
              const duration = minutesToDuration(chart.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as number);
              return `${categoryName}: ${duration}`;
            }
          }
        },
        aspectRatio: 1
      }
    };
  }

  private createCategoryStatistics(): Array<CategoryStatistic> {
    const categoryStatisticsByCategoryId = new Map<number, CategoryStatistic>();
    this.statisticsModel.statistics
      .filter(stat => (this.criteriaForm.value.by === ALL_USERS) || (stat.user.id === this.criteriaForm.value.by))
      .forEach(stat => {
        const categoryId = stat.category.id;
        let categoryStatistic = categoryStatisticsByCategoryId.get(categoryId);
        if (!categoryStatistic) {
          categoryStatistic = {
            category: stat.category,
            minutes: 0
          };
          categoryStatisticsByCategoryId.set(categoryId, categoryStatistic);
        }
        categoryStatistic.minutes += stat.minutes;
      });

    return sortBy(Array.from(categoryStatisticsByCategoryId.values()), c => c.category.name);
  }
}
