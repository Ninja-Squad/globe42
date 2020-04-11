import { Pipe, PipeTransform } from '@angular/core';
import { PassportStatus } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const PASSPORT_STATUS_TRANSLATIONS: Array<{ key: PassportStatus; translation: string }> = [
  { key: 'PASSPORT', translation: 'Oui' },
  { key: 'NO_PASSPORT', translation: 'Non' },
  { key: 'UNKNOWN', translation: 'Inconnu' }
];

@Pipe({
  name: 'displayPassportStatus'
})
export class DisplayPassportStatusPipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(PASSPORT_STATUS_TRANSLATIONS);
  }
}
