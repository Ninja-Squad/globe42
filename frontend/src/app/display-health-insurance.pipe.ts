import { Pipe, PipeTransform } from '@angular/core';
import { HealthInsurance } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const HEALTH_INSURANCE_TRANSLATIONS: Record<HealthInsurance, string> = {
  UNKNOWN: 'Inconnue',
  NONE: 'Aucune',
  C2S_WITHOUT_FINANCIAL_PARTICIPATION: 'C2S - Sans participation financière',
  C2S_WITH_FINANCIAL_PARTICIPATION: 'C2S - Avec participation financière',
  CMUC: 'CMU-C',
  AME: "Aide médicale de l'Etat",
  ACS: 'Aide à la Complémentaire Santé',
  MUTUELLE: 'Mutuelle privée'
};

@Pipe({
  name: 'displayHealthInsurance'
})
export class DisplayHealthInsurancePipe
  extends BaseEnumPipe<HealthInsurance>
  implements PipeTransform {
  constructor() {
    super(HEALTH_INSURANCE_TRANSLATIONS);
  }
}
