import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'gl-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit, OnChanges {

  @Input() configuration: ChartConfiguration;
  @ViewChild('canvas') canvas: ElementRef;

  private chart: Chart;

  ngOnChanges(changes: SimpleChanges) {
    this.createChart();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.canvas) {
      const ctx = this.canvas.nativeElement;
      this.chart = new Chart(ctx, this.configuration);
    }
  }
}
