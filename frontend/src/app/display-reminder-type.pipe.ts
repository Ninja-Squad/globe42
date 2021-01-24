import { Pipe, PipeTransform } from '@angular/core';
import { ReminderType } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const REMINDER_TYPE_TRANSLATIONS: Record<ReminderType, string> = {
  HEALTH_INSURANCE_TO_RENEW: 'Assurance santé à renouveler',
  RESIDENCE_PERMIT_TO_RENEW: 'Titre de séjour à renouveler',
  HEALTH_CHECK_TO_PLAN: 'Bilan de santé à planifier',
  MEMBERSHIP_TO_RENEW: 'Adhésion à renouveler',
  MEMBERSHIP_PAYMENT_OUT_OF_DATE: `Paiement d'adhésion à finaliser`
};

@Pipe({
  name: 'displayReminderType'
})
export class DisplayReminderTypePipe extends BaseEnumPipe<ReminderType> implements PipeTransform {
  constructor() {
    super(REMINDER_TYPE_TRANSLATIONS);
  }
}
