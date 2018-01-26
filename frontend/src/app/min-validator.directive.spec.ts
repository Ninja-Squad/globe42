/* tslint:disable:deprecation (false positive) */
import { MinValidatorDirective } from './min-validator.directive';
import { Component } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
  template: `<form>
    <input type="number" [min]="min" name="value" [(ngModel)]="value"/>
  </form>`
})
class TestComponent {
  min: number = null;
  value: number = null;
}

describe('MinValidatorDirective', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TestComponent, MinValidatorDirective]
    });
  }));

  it('should validate when using template-based form', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    tick();

    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

    expect(form.hasError('min', ['value'])).toBe(false);
    expect(fixture.nativeElement.querySelector('input').hasAttribute('min')).toBeFalsy();

    fixture.componentInstance.min = 10;
    fixture.detectChanges();
    tick();
    expect(form.hasError('min', ['value'])).toBe(false);
    expect(fixture.nativeElement.querySelector('input').getAttribute('min')).toBe('10');

    fixture.componentInstance.value = 10;
    fixture.detectChanges();
    tick();
    expect(form.hasError('min', ['value'])).toBe(false);

    fixture.componentInstance.value = 9;
    fixture.detectChanges();
    tick();
    expect(form.hasError('min', ['value'])).toBe(true);
  }));
});
