import { Pipe, PipeTransform } from '@angular/core';
import { HealthCareCoverage } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const HEALTH_CARE_COVERAGE_TRANSLATIONS: Record<HealthCareCoverage, string> = {
  UNKNOWN: 'Inconnue',
  NONE: 'Aucune',
  GENERAL: 'Régime général',
  PUMA: 'Protection Universelle Maladie',
  AGR: 'Régime agricole',
  AME: "Aide médicale de l'Etat",
  SSI: 'Sécurité sociale des indépendants',
  CNAREFE: "Centre National des Retraités de France à l'Étranger",
  OTHER: 'Autre'
};

@Pipe({
  name: 'displayHealthCareCoverage'
})
export class DisplayHealthCareCoveragePipe
  extends BaseEnumPipe<HealthCareCoverage>
  implements PipeTransform {
  constructor() {
    super(HEALTH_CARE_COVERAGE_TRANSLATIONS);
  }
}
