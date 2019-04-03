import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export function min(minValue: any): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return null;
    }
    return control.value >= minValue ? null : { min: true };
  };
}

export function max(maxValue: any): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return null;
    }
    return control.value <= maxValue ? null : { max: true };
  };
}

export const pastDate: ValidatorFn = (control: AbstractControl) => {
  if (!control.value) {
    return null;
  }
  return control.value <= DateTime.local().toISODate() ? null : { pastDate: true };
};
