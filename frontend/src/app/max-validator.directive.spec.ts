import { Component } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MaxValidatorDirective } from './max-validator.directive';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'gl-test',
  template: `<form>
    <input type="number" [max]="max" name="value" [(ngModel)]="value"/>
  </form>`
})
class TestComponent {
  max: number = null;
  value: number = null;
}

describe('MaxValidatorDirective', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TestComponent, MaxValidatorDirective]
    });
  }));

  it('should validate', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    tick();

    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

    expect(form.hasError('max', ['value'])).toBe(false);
    expect(fixture.nativeElement.querySelector('input').hasAttribute('max')).toBeFalsy();

    fixture.componentInstance.max = 10;
    fixture.detectChanges();
    tick();
    expect(form.hasError('max', ['value'])).toBe(false);
    expect(fixture.nativeElement.querySelector('input').getAttribute('max')).toBe('10');

    fixture.componentInstance.value = 10;
    fixture.detectChanges();
    tick();
    expect(form.hasError('max', ['value'])).toBe(false);

    fixture.componentInstance.value = 11;
    fixture.detectChanges();
    tick();
    expect(form.hasError('max', ['value'])).toBe(true);
  }));
});
