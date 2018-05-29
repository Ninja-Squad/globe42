import { async, TestBed } from '@angular/core/testing';

import { ValidationErrorsComponent } from './validation-errors.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentTester, speculoosMatchers } from 'ngx-speculoos';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="foo" />
      <gl-validation-errors [control]="form.get('foo')">
        error message
      </gl-validation-errors>
      <button>Submit</button>
    </form>
  `
})
class TestComponent {
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      foo: ['', Validators.required]
    });
  }

  submit() {}
}

class ValidationErrorsComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get testInput() {
    return this.input('input');
  }

  get errors() {
    return this.element('gl-validation-errors');
  }

  get submit() {
    return this.button('button');
  }
}

describe('ValidationErrorsComponent', () => {
  let tester: ValidationErrorsComponentTester;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        ValidationErrorsComponent
      ],
      imports: [
        ReactiveFormsModule
      ]
    });

    tester = new ValidationErrorsComponentTester();
    tester.detectChanges();

    jasmine.addMatchers(speculoosMatchers);
  }));

  it('should not display error message if not blurred nor submitted', () => {
    expect(tester.errors).not.toContainText('error message');
  });

  it('should display error message if blurred', () => {
    tester.testInput.dispatchEventOfType('blur');

    expect(tester.errors).toContainText('error message');
  });

  it('should display error message if submitted', () => {
    tester.submit.click();

    expect(tester.errors).toContainText('error message');
  });

  it('should not display error message if valid', () => {
    tester.testInput.fillWith('hello');
    tester.submit.click();

    expect(tester.errors).not.toContainText('error message');
  });

  it('should have CSS class which changes if error should be shown', () => {
    expect(tester.errors).toHaveClass('invalid-feedback');
    expect(tester.errors).not.toHaveClass('d-block');
    expect(tester.errors).toHaveClass('d-none');

    tester.submit.click();

    expect(tester.errors).toHaveClass('invalid-feedback');
    expect(tester.errors).toHaveClass('d-block');
    expect(tester.errors).not.toHaveClass('d-none');

    tester.testInput.fillWith('hello');

    expect(tester.errors).toHaveClass('invalid-feedback');
    expect(tester.errors).not.toHaveClass('d-block');
    expect(tester.errors).toHaveClass('d-none');
  });
});
