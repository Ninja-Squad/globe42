import { Pipe, PipeTransform } from '@angular/core';
import { Visa } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const VISA_TRANSLATIONS: Record<Visa, string> = {
  UNKNOWN: 'Inconnu',
  NONE: 'Aucun',
  SHORT_STAY: 'C (court séjour)',
  LONG_STAY: 'D (long séjour)'
};

@Pipe({
  name: 'displayVisa'
})
export class DisplayVisaPipe extends BaseEnumPipe<Visa> implements PipeTransform {
  constructor() {
    super(VISA_TRANSLATIONS);
  }
}
