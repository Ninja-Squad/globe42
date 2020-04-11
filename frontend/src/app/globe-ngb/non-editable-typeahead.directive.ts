/* tslint:disable:directive-selector */

import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

/**
 * Directive which automatically clears the input on blur when an ngbTypeahead is applied to the input
 * if its editable input is false and the value in the model is falsy (indicating that the entered value is not
 * a valid value). It also applies an is-warning CSS class in the same conditions.
 */
@Directive({
  selector: '[ngbTypeahead]'
})
export class NonEditableTypeaheadDirective {
  constructor(
    private ngControl: NgControl,
    private elementRef: ElementRef<HTMLInputElement>,
    private typeahead: NgbTypeahead
  ) {}

  @HostListener('blur')
  onBlur() {
    if (!this.ngControl.value && !this.typeahead.editable) {
      this.elementRef.nativeElement.value = '';
    }
  }

  @HostBinding('class.is-warning')
  get isWarning() {
    return !this.typeahead.editable && this.elementRef.nativeElement.value && !this.ngControl.value;
  }
}
