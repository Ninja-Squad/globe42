import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HealthCareCoverageModel } from '../models/health-care-coverage.model';
import {
  ArcElement,
  Chart,
  ChartConfiguration,
  DoughnutController,
  Legend,
  Tooltip
} from 'chart.js';
import { COLORS } from '../chart/chart.component';
import { HEALTH_CARE_COVERAGE_TRANSLATIONS } from '../display-health-care-coverage.pipe';

@Component({
  selector: 'gl-healthcare-coverage',
  templateUrl: './health-care-coverage.component.html',
  styleUrls: ['./health-care-coverage.component.css']
})
export class HealthCareCoverageComponent implements OnInit {
  coverage: HealthCareCoverageModel;
  totalCount: number;
  coveredCount: number;
  chartConfiguration: ChartConfiguration<'doughnut'>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.coverage = this.route.snapshot.data.coverage;
    this.totalCount = 0;
    this.coveredCount = 0;
    this.coverage.entries.forEach(entry => {
      this.totalCount += entry.count;
      if (entry.coverage !== 'UNKNOWN' && entry.coverage !== 'NONE') {
        this.coveredCount += entry.count;
      }
    });
    this.chartConfiguration = this.createChartConfiguration();
  }

  private createChartConfiguration(): ChartConfiguration<'doughnut'> {
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

    const labels: Array<string> = [];
    const data: Array<number> = [];
    const backgroundColor: Array<string> = [];

    this.coverage.entries.forEach((value, index) => {
      labels.push(HEALTH_CARE_COVERAGE_TRANSLATIONS[value.coverage]);
      data.push(value.count);
      backgroundColor.push(COLORS[index % COLORS.length]);
    });

    return {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor }] },
      options: {
        cutout: '70%',
        plugins: {
          tooltip: {
            callbacks: {
              label(tooltipItem) {
                const categoryName = tooltipItem.label;
                const count = tooltipItem.parsed;
                return `${categoryName}: ${count}`;
              }
            }
          }
        },
        aspectRatio: 1
      }
    };
  }
}
