import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { PaymentMode } from './models/membership.model';

export const PAYMENT_MODE_TRANSLATIONS: Array<{ key: PaymentMode; translation: string; }> = [
  {key: 'CASH', translation: 'Espèces'},
  {key: 'CHECK', translation: 'Chèque'},
  {key: 'UNKNOWN', translation: 'Inconnu'}
];

@Pipe({
  name: 'displayPaymentMode'
})
export class DisplayPaymentModePipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(PAYMENT_MODE_TRANSLATIONS);
  }
}
