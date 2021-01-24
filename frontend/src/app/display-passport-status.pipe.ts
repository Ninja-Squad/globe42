import { Pipe, PipeTransform } from '@angular/core';
import { PassportStatus } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const PASSPORT_STATUS_TRANSLATIONS: Record<PassportStatus, string> = {
  PASSPORT: 'Oui',
  NO_PASSPORT: 'Non',
  UNKNOWN: 'Inconnu'
};

@Pipe({
  name: 'displayPassportStatus'
})
export class DisplayPassportStatusPipe
  extends BaseEnumPipe<PassportStatus>
  implements PipeTransform {
  constructor() {
    super(PASSPORT_STATUS_TRANSLATIONS);
  }
}
