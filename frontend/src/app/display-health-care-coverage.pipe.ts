import { Pipe, PipeTransform } from '@angular/core';
import { HealthCareCoverage } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const HEALTH_CARE_COVERAGE_TRANSLATIONS: Array<{ key: HealthCareCoverage; translation: string; }> = [
  {key: 'UNKNOWN', translation: 'Inconnue'},
  {key: 'GENERAL', translation: 'Régime général'},
  {key: 'PUMA', translation: 'Protection Universelle Maladie'},
  {key: 'AGR', translation: 'Régime agricole'},
  {key: 'AME', translation: 'Aide médicale de l\'Etat'},
  {key: 'SSI', translation: 'Sécurité sociale des indépendants'},
  {key: 'OTHER', translation: 'Autre'}
];

@Pipe({
  name: 'displayHealthCareCoverage'
})
export class DisplayHealthCareCoveragePipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(HEALTH_CARE_COVERAGE_TRANSLATIONS);
  }
}
