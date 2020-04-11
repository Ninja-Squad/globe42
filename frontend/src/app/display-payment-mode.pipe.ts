import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { PaymentMode } from './models/membership.model';

export const PAYMENT_MODE_TRANSLATIONS: Array<{ key: PaymentMode; translation: string }> = [
  { key: 'CHECK', translation: 'Chèque' },
  { key: 'CASH', translation: 'Espèces' },
  { key: 'FREE', translation: 'Gratuité' },
  { key: 'OUT_OF_DATE', translation: 'Pas à jour' },
  { key: 'UNKNOWN', translation: 'Inconnu' }
];

@Pipe({
  name: 'displayPaymentMode'
})
export class DisplayPaymentModePipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(PAYMENT_MODE_TRANSLATIONS);
  }
}
