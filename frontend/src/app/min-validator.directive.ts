/* tslint:disable:directive-selector */
/* tslint:disable:no-use-before-declare */
import { Directive, forwardRef, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';

/**
 * Provider which adds MinValidatorDirective to NG_VALIDATORS.
 */
export const MIN_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinValidatorDirective),
  multi: true
};

/**
 * A directive which installs the MinValidator for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `min` attribute.
 */
@Directive({
  selector: '[min][type=number][formControlName],[min][type=number][formControl],[min][type=number][ngModel]',
  providers: [MIN_VALIDATOR]
})
export class MinValidatorDirective implements Validator, OnChanges {
  private _validator: ValidatorFn;
  private _onChange: () => void;
  private _min: number;

  @Input()
  set min(min: number) {
    this._min = min;
    this._createValidator();
    if (this._onChange) {
      this._onChange();
    }
  }

  get min(): number {
    return this._min;
  }

  @HostBinding('attr.min') get maxAttr() {
    return this.min !== null && this.min !== undefined ? `${this.min}` : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('min' in changes) {
      this._createValidator();
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.min == null ? null : this._validator(c);
  }

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

  private _createValidator(): void {
    this._validator = Validators.min(this.min);
  }
}
