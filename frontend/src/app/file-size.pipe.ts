import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

const UNITS = ['o', 'Ko', 'Mo', 'Go'];
const KILO = 1000;

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  private decimalPipe: DecimalPipe;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.decimalPipe = new DecimalPipe(locale);
  }

  transform(value: number): any {
    if (value === null || value === undefined) {
      return '';
    }
    let multiplicator = 1;
    for (let i = 0; i < UNITS.length; i++) {
      const limit = multiplicator * KILO;
      if (value < limit || i === UNITS.length - 1) {
        const displayedValue = value / multiplicator;
        return `${this.decimalPipe.transform(displayedValue, '1.0-1')}\u202f${UNITS[i]}`;
      }
      multiplicator = limit;
    }
  }
}
