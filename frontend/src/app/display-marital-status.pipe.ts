import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';

export const MARITAL_STATUS_TRANSLATIONS = [
  {key: 'MARRIED', translation: 'Marié(e)'},
  {key: 'SINGLE', translation: 'Célibataire'},
  {key: 'CONCUBINAGE', translation: 'En concubinage'},
  {key: 'WIDOWER', translation: 'Veuf(ve)'},
  {key: 'DIVORCED', translation: 'Divorcé(e)'},
  {key: 'SPLIT', translation: 'Séparé(e)'}
];

@Pipe({
  name: 'displayMaritalStatus'
})
export class DisplayMaritalStatusPipe extends BaseEnumPipe {

  constructor() {
    super(MARITAL_STATUS_TRANSLATIONS);
  }
}
