import { Pipe, PipeTransform } from '@angular/core';
import { Housing } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const HOUSING_TRANSLATIONS: Record<Housing, string> = {
  UNKNOWN: 'Inconnu',
  NONE: 'Aucun',
  EMERGENCY: '115',
  F0: 'F0',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6 ou plus'
};

@Pipe({
  name: 'displayHousing'
})
export class DisplayHousingPipe extends BaseEnumPipe<Housing> implements PipeTransform {
  constructor() {
    super(HOUSING_TRANSLATIONS);
  }
}
