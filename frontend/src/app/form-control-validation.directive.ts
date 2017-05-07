/* tslint:disable:directive-selector */
import { ContentChild, Directive, HostBinding } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '.form-group:not([ngbNoFormControlValidation]),[ngbFormControlValidation]'
})
export class FormControlValidationDirective {

  @ContentChild(NgControl)
  ngControl: NgControl;

  constructor() { }

  @HostBinding('class.has-danger') get hasDanger() {
    return this.ngControl && this.ngControl.dirty && this.ngControl.invalid;
  }
}
