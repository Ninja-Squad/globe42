import { Component, OnInit } from '@angular/core';
import { TaskCategoryModel } from '../models/task-category.model';
import { TaskService } from '../task.service';
import { ChartConfiguration } from 'chart.js';
import { minutesToDuration, sortBy } from '../utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { NowService } from '../now.service';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/empty';

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

@Component({
  selector: 'gl-spent-time-statistics',
  templateUrl: './spent-time-statistics.component.html',
  styleUrls: ['./spent-time-statistics.component.scss']
})
export class SpentTimeStatisticsComponent implements OnInit {

  criteriaForm: FormGroup;
  chartConfiguration: ChartConfiguration;
  categoryStatistics: Array<CategoryStatistic>;

  constructor(fb: FormBuilder,
              private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute,
              private nowService: NowService) {
    this.criteriaForm = fb.group({
      from: null,
      to: null
    });
  }

  ngOnInit() {
    // If no param, default to the current month
    const paramMap = this.route.snapshot.queryParamMap;
    if (!paramMap.get('from') && !paramMap.get('to')) {
      this.criteriaForm.setValue( {
        from: this.nowService.now().startOf('month').toISODate(),
        to: this.nowService.now().endOf('month').toISODate()
      });
    } else {
      this.criteriaForm.setValue( {
        from: paramMap.get('from'),
        to: paramMap.get('to')
      });
    }

    Observable.of(this.criteriaForm.value).concat(this.criteriaForm.valueChanges)
      .filter(() => this.criteriaForm.valid)
      .do(value => this.router.navigate(['tasks/statistics'], { queryParams: value, replaceUrl: true }))
      .switchMap(() => this.taskService.spentTimeStatistics(this.criteriaForm.value).catch(() => Observable.empty()))
      .subscribe(stats => this.updateState(stats));
  }

  private updateState(stats) {
    this.categoryStatistics = this.createCategoryStatistics(stats);
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
        }
      }
    };
  }

  private createCategoryStatistics(stats): Array<CategoryStatistic> {
    const categoryStatisticsByCategoryId = new Map<number, CategoryStatistic>();
    stats.statistics.forEach(stat => {
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
