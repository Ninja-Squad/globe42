import { Pipe, PipeTransform } from '@angular/core';
import { HealthInsurance } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const HEALTH_INSURANCE_TRANSLATIONS: Array<{ key: HealthInsurance; translation: string }> = [
  { key: 'UNKNOWN', translation: 'Inconnue' },
  { key: 'NONE', translation: 'Aucune' },
  {
    key: 'C2S_WITHOUT_FINANCIAL_PARTICIPATION',
    translation: 'C2S - Sans participation financière'
  },
  { key: 'C2S_WITH_FINANCIAL_PARTICIPATION', translation: 'C2S - Avec participation financière' },
  { key: 'CMUC', translation: 'CMU-C' },
  { key: 'AME', translation: "Aide médicale de l'Etat" },
  { key: 'ACS', translation: 'Aide à la Complémentaire Santé' },
  { key: 'MUTUELLE', translation: 'Mutuelle privée' }
];

@Pipe({
  name: 'displayHealthInsurance'
})
export class DisplayHealthInsurancePipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(HEALTH_INSURANCE_TRANSLATIONS);
  }
}
