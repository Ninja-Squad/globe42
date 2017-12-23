/* tslint:disable:directive-selector */
/* tslint:disable:no-use-before-declare */
import { Directive, forwardRef, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';

/**
 * Provider which adds MaxValidatorDirective to NG_VALIDATORS.
 */
export const MAX_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxValidatorDirective),
  multi: true
};

/**
 * A directive which installs the MaxValidator for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `max` attribute.
 */
@Directive({
  selector: '[max][type=number][formControlName],[max][type=number][formControl],[max][type=number][ngModel]',
  providers: [MAX_VALIDATOR]
})
export class MaxValidatorDirective implements Validator, OnChanges {
  private _validator: ValidatorFn;
  private _onChange: () => void;
  private _max: number;

  @Input() set max(max: number) {
    this._max = max;
    this._createValidator();
    if (this._onChange) {
      this._onChange();
    }
  }

  get max(): number {
    return this._max;
  }

  @HostBinding('attr.max') get maxAttr() {
    return this.max !== null && this.max !== undefined ? `${this.max}` : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('max' in changes) {
      this._createValidator();
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.max == null ? null : this._validator(c);
  }

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

  private _createValidator(): void {
    this._validator = Validators.max(this.max);
  }
}
