import { ChartComponent } from './chart.component';
import { Component } from '@angular/core';
import { ArcElement, Chart, ChartConfiguration, DoughnutController } from 'chart.js';
import { TestBed } from '@angular/core/testing';
import { ComponentTester } from 'ngx-speculoos';

@Component({
  selector: 'gl-test',
  template: '<gl-chart [configuration]="configuration"></gl-chart>'
})
class TestComponent {
  constructor() {
    Chart.register(DoughnutController, ArcElement);
  }

  configuration: ChartConfiguration = {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [1, 2, 3]
        }
      ],
      labels: ['a', 'b', 'c']
    },
    options: {
      animation: false
    }
  };
}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get canvas() {
    return this.element('canvas');
  }

  get chartComponent(): ChartComponent {
    return this.component(ChartComponent);
  }
}

describe('ChartComponent', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent, TestComponent]
    });

    tester = new TestComponentTester();
    tester.detectChanges();
  });

  it('should display a chart', () => {
    expect(tester.canvas.nativeElement.toDataURL().length).toBeGreaterThan(0);
    expect(tester.chartComponent.configuration).toBe(tester.componentInstance.configuration);
  });

  it('should display a different chart when input changes', () => {
    tester.detectChanges();
    const firstImage = tester.canvas.nativeElement.toDataURL();

    const newConfiguration: ChartConfiguration = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [4, 5, 6]
          }
        ],
        labels: ['a', 'b', 'c']
      },
      options: {
        animation: false
      }
    };
    tester.componentInstance.configuration = newConfiguration;
    tester.detectChanges();

    expect(tester.canvas.nativeElement.toDataURL()).not.toBe(firstImage);
    expect(tester.chartComponent.configuration).toBe(newConfiguration);
  });
});
