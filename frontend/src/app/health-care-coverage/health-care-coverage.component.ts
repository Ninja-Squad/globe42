import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HealthCareCoverageModel } from '../models/health-care-coverage.model';
import { ChartConfiguration } from 'chart.js';
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
  chartConfiguration: ChartConfiguration;

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

  private createChartConfiguration(): ChartConfiguration {
    const labels: Array<string> = [];
    const data: Array<number> = [];
    const backgroundColor: Array<string> = [];

    this.coverage.entries.forEach((value, index) => {
      labels.push(
        HEALTH_CARE_COVERAGE_TRANSLATIONS.find(t => t.key === value.coverage).translation
      );
      data.push(value.count);
      backgroundColor.push(COLORS[index % COLORS.length]);
    });

    return {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor }] },
      options: {
        cutoutPercentage: 70,
        tooltips: {
          callbacks: {
            label: (tooltipItem, chart) => {
              const categoryName = chart.labels[tooltipItem.index];
              const count = chart.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ] as number;
              return `${categoryName}: ${count}`;
            }
          }
        },
        aspectRatio: 1
      }
    };
  }
}
