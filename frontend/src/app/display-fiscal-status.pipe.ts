import { Pipe, PipeTransform } from '@angular/core';
import { FiscalStatus } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const FISCAL_STATUS_TRANSLATIONS: Record<FiscalStatus, string> = {
  UNKNOWN: 'Inconnue',
  TAXABLE: 'Imposable',
  NOT_TAXABLE: 'Non imposable'
};

@Pipe({
  name: 'displayFiscalStatus'
})
export class DisplayFiscalStatusPipe extends BaseEnumPipe<FiscalStatus> implements PipeTransform {
  constructor() {
    super(FISCAL_STATUS_TRANSLATIONS);
  }
}
