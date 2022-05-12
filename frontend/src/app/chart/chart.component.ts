import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

export const COLORS = [
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
  selector: 'gl-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() configuration: ChartConfiguration<any>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  private chart: Chart;

  constructor(private ngZone: NgZone) {}

  ngOnChanges() {
    this.createChart();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.canvas) {
      const ctx = this.canvas.nativeElement;
      this.chart = this.ngZone.runOutsideAngular(() => new Chart(ctx, this.configuration));
    }
  }
}
