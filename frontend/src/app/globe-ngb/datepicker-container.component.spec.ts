import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgbDatepicker, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ComponentTester } from 'ngx-speculoos';
import { GlobeNgbTestingModule } from './globe-ngb-testing.module';

@Component({
  template: `
    <gl-datepicker-container>
      <input class="form-control" [formControl]="dateCtrl" ngbDatepicker />
    </gl-datepicker-container>
  `
})
class TestComponent {
  dateCtrl = new FormControl();
}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get wrapper() {
    return this.element('div');
  }

  get toggler() {
    return this.button('button');
  }

  get inputDatepicker() {
    return this.debugElement.query(By.directive(NgbInputDatepicker));
  }

  get datepicker() {
    return this.debugElement.query(By.directive(NgbDatepicker));
  }
}

describe('DatepickerContainerComponent', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobeNgbTestingModule, ReactiveFormsModule],
      declarations: [TestComponent]
    });

    tester = new TestComponentTester();
    tester.detectChanges();
  });

  it('should display a toggle button, an input, and toggle the datepicker', () => {
    expect(tester.toggler).not.toBeNull();
    expect(tester.inputDatepicker).toBeTruthy();
    expect(tester.datepicker).toBeFalsy();

    tester.toggler.click();

    expect(tester.datepicker).toBeTruthy();

    tester.toggler.click();

    expect(tester.datepicker).toBeFalsy();
  });

  it('should have the input-group class', () => {
    expect(tester.wrapper).toHaveClass('input-group');
  });
});
