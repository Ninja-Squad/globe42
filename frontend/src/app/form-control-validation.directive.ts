/* tslint:disable:directive-selector */
import { Directive, HostBinding, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '.form-control:not([glFormControlValidation]),[glFormControlValidation],[ngbRadioGroup]'
})
export class FormControlValidationDirective {

  constructor(@Optional() private ngControl: NgControl) { }

  @HostBinding('class.is-invalid') get isInvalid() {
    return this.ngControl
      && this.ngControl.invalid
      && (this.ngControl.touched || (this.ngControl['formDirective'] && this.ngControl['formDirective'].submitted));
  }
}
