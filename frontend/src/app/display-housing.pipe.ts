import { Pipe, PipeTransform } from '@angular/core';
import { Housing } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const HOUSING_TRANSLATIONS: Array<{ key: Housing; translation: string }> = [
  { key: 'UNKNOWN', translation: 'Inconnu' },
  { key: 'NONE', translation: 'Aucun' },
  { key: 'EMERGENCY', translation: '115' },
  { key: 'F0', translation: 'F0' },
  { key: 'F1', translation: 'F1' },
  { key: 'F2', translation: 'F2' },
  { key: 'F3', translation: 'F3' },
  { key: 'F4', translation: 'F4' },
  { key: 'F5', translation: 'F5' },
  { key: 'F6', translation: 'F6 ou plus' }
];

@Pipe({
  name: 'displayHousing'
})
export class DisplayHousingPipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(HOUSING_TRANSLATIONS);
  }
}
