import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { PaymentMode } from './models/membership.model';

const PAYMENT_MODE_TRANSLATIONS: Record<PaymentMode, string> = {
  CHECK: 'Chèque',
  CASH: 'Espèces',
  FREE: 'Gratuité',
  OUT_OF_DATE: 'Pas à jour',
  UNKNOWN: 'Inconnu'
};

@Pipe({
  name: 'displayPaymentMode'
})
export class DisplayPaymentModePipe extends BaseEnumPipe<PaymentMode> implements PipeTransform {
  constructor() {
    super(PAYMENT_MODE_TRANSLATIONS);
  }
}
