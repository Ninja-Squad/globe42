import { ChartComponent } from './chart.component';
import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'gl-test',
  template: '<gl-chart [configuration]="configuration"></gl-chart>'
})
class TestComponent {
  configuration: ChartConfiguration = {
    type: 'pie',
    data: {
      datasets: [
        {
          data: [1, 2, 3]
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      }
    }
  };
}

describe('ChartComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent, TestComponent]
    });
  });

  it('should display a chart', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('canvas');
    expect(canvas.toDataURL().length).toBeGreaterThan(0);
    const chartComponent: ChartComponent = fixture.debugElement.query(By.directive(ChartComponent)).componentInstance;
    expect(chartComponent.configuration).toBe(fixture.componentInstance.configuration);
  });

  it('should display a different chart when input changes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('canvas');
    const firstImage = canvas.toDataURL();
    const chartComponent: ChartComponent = fixture.debugElement.query(By.directive(ChartComponent)).componentInstance;

    const newConfiguration: ChartConfiguration = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [4, 5, 6]
          }
        ]
      },
      options: {
        animation: {
          duration: 0
        }
      }
    };
    fixture.componentInstance.configuration = newConfiguration;
    fixture.detectChanges();

    expect(canvas.toDataURL()).not.toBe(firstImage);
    expect(chartComponent.configuration).toBe(newConfiguration);
  });
});

