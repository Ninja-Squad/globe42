import { FormControlValidationDirective } from './form-control-validation.directive';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

@Component({
  template: `
    <form [formGroup]="personForm" (ngSubmit)="submit()">
      <div class="form-group row">
        <label for="lastName" class="col-sm-2 col-form-label">Nom</label>
        <div class="col-sm-10">
          <input class="form-control" id="lastName" placeholder="Nom" formControlName="lastName" />
        </div>
      </div>
      <button id="save">Save</button>
    </form>
  `
})
class FormComponent {
  personForm = new FormGroup({
    lastName: new FormControl('', Validators.required)
  });
  submit() {}
}

describe('FormControlValidationDirective', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FormComponent, FormControlValidationDirective]
    })
  );

  it('should add the is-invalid CSS class when touched', () => {
    const fixture = TestBed.createComponent(FormComponent);
    fixture.detectChanges();

    const lastName = fixture.nativeElement.querySelector('#lastName');
    expect(lastName.classList).not.toContain('is-invalid');

    lastName.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(lastName.classList).toContain('is-invalid');
  });

  it('should add the is-invalid CSS class when enclosing form is submitted', () => {
    const fixture = TestBed.createComponent(FormComponent);
    fixture.detectChanges();

    const lastName = fixture.nativeElement.querySelector('#lastName');
    expect(lastName.classList).not.toContain('is-invalid');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('#save');
    button.click();
    fixture.detectChanges();

    expect(lastName.classList).toContain('is-invalid');
  });
});
