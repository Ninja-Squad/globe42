import { FormControlValidationDirective } from './form-control-validation.directive';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

@Component({
  template: `
    <form [formGroup]="personForm">
      <div class="form-group row">
        <label for="lastName" class="col-sm-2 col-form-label">Nom</label>
        <div class="col-sm-10">
          <input class="form-control" id="lastName" placeholder="Nom" formControlName="lastName">
        </div>
      </div>
    </form>`
})
class FormComponent {
  personForm = new FormGroup({
    lastName: new FormControl('', Validators.required)
  });
}

describe('FormControlValidationDirective', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    declarations: [FormComponent, FormControlValidationDirective]
  }));

  it('should add the has-danger CSS class', () => {
    const fixture = TestBed.createComponent(FormComponent);
    fixture.detectChanges();

    const lastName = fixture.nativeElement.querySelector('#lastName');
    lastName.value = '';
    lastName.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('.form-group');
    expect(group.classList).toContain('has-danger');
  });
});
