import { Pipe, PipeTransform } from '@angular/core';
import { FiscalStatus } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const FISCAL_STATUS_TRANSLATIONS: Array<{ key: FiscalStatus; translation: string; }> = [
  {key: 'UNKNOWN', translation: 'Inconnue'},
  {key: 'TAXABLE', translation: 'Imposable'},
  {key: 'NOT_TAXABLE', translation: 'Non imposable'}
];

@Pipe({
  name: 'displayFiscalStatus'
})
export class DisplayFiscalStatusPipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(FISCAL_STATUS_TRANSLATIONS);
  }
}
