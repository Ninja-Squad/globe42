import { Pipe, PipeTransform } from '@angular/core';
import { Visa } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const VISA_TRANSLATIONS: Array<{ key: Visa; translation: string; }> = [
  {key: 'UNKNOWN', translation: 'Inconnu'},
  {key: 'SHORT_STAY', translation: 'C (court séjour)'},
  {key: 'LONG_STAY', translation: 'D (long séjour)'},
];

@Pipe({
  name: 'displayVisa'
})
export class DisplayVisaPipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(VISA_TRANSLATIONS);
  }
}
