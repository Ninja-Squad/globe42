import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlobeNgbModule } from './globe-ngb.module';
import { By } from '@angular/platform-browser';
import { NgbDatepicker, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerContainerComponent } from './datepicker-container.component';

@Component({
  template: `<gl-datepicker-container class="foo">
    <input class="form-control" [formControl]="dateCtrl" ngbDatepicker />
  </gl-datepicker-container>
  `
})
class TestComponent {
  dateCtrl = new FormControl();
}

describe('DatepickerContainerComponent', () => {
  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [GlobeNgbModule.forRoot(), ReactiveFormsModule],
    declarations: [TestComponent]
  })));

  it('should display a toggle button, an input, and toggle the datepicker', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const toggler = fixture.nativeElement.querySelector('.input-group-prepend .fa-calendar');
    expect(toggler).toBeTruthy();

    const inputDatepicker = fixture.debugElement.query(By.directive(NgbInputDatepicker));
    expect(inputDatepicker).toBeTruthy();

    let datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
    expect(datepicker).toBeFalsy();

    toggler.click();
    fixture.detectChanges();

    datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
    expect(datepicker).toBeTruthy();

    toggler.click();
    fixture.detectChanges();

    datepicker = fixture.debugElement.query(By.directive(NgbDatepicker));
    expect(datepicker).toBeFalsy();
  });

  it('should have the input-group class in addition to its original class', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.directive(DatepickerContainerComponent)).nativeElement;

    expect(container.classList.contains('input-group')).toBe(true);
    expect(container.classList.contains('foo')).toBe(true);
  });
});

