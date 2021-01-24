import { Pipe, PipeTransform } from '@angular/core';
import { ReminderType } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const REMINDER_TYPE_TRANSLATIONS: Array<{ key: ReminderType; translation: string }> = [
  { key: 'HEALTH_INSURANCE_TO_RENEW', translation: 'Assurance santé à renouveler' },
  { key: 'RESIDENCE_PERMIT_TO_RENEW', translation: 'Titre de séjour à renouveler' },
  { key: 'HEALTH_CHECK_TO_PLAN', translation: 'Bilan de santé à planifier' },
  { key: 'MEMBERSHIP_TO_RENEW', translation: 'Adhésion à renouveler' },
  { key: 'MEMBERSHIP_PAYMENT_OUT_OF_DATE', translation: `Paiement d'adhésion à finaliser` }
];

@Pipe({
  name: 'displayReminderType'
})
export class DisplayReminderTypePipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(REMINDER_TYPE_TRANSLATIONS);
  }
}
