import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlobeNgbModule } from './globe-ngb.module';
import { By } from '@angular/platform-browser';
import { NgbDatepicker, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ComponentTester } from 'ngx-speculoos';

@Component({
  template: `
    <gl-datepicker-container class="foo">
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

  get toggler() {
    return this.element<HTMLElement>('.input-group-prepend .fa-calendar');
  }

  get inputDatepicker() {
    return this.debugElement.query(By.directive(NgbInputDatepicker));
  }

  get datepicker() {
    return this.debugElement.query(By.directive(NgbDatepicker));
  }

  get container() {
    return this.element('gl-datepicker-container');
  }
}

describe('DatepickerContainerComponent', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobeNgbModule.forRoot(), ReactiveFormsModule],
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

  it('should have the input-group class in addition to its original class', () => {
    expect(tester.container).toHaveClass('input-group');
    expect(tester.container).toHaveClass('foo');
  });
});
