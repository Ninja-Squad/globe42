import { Pipe, PipeTransform } from '@angular/core';
import { HealthCareCoverage } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const HEALTH_CARE_COVERAGE_TRANSLATIONS: Array<{ key: HealthCareCoverage; translation: string; }> = [
  {key: 'UNKNOWN', translation: 'Inconnue'},
  {key: 'GENERAL', translation: 'Régime général'},
  {key: 'MSA', translation: 'Régime agricole MSA'},
  {key: 'RSI', translation: 'Régime Social des Indépendants'},
  {key: 'AME', translation: 'Aide médicale de l\'Etat'},
  {key: 'CMU', translation: 'Couverture Maladie Universelle'},
  {key: 'SPECIAL', translation: 'Régime spécial'}
];

@Pipe({
  name: 'displayHealthCareCoverage'
})
export class DisplayHealthCareCoveragePipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(HEALTH_CARE_COVERAGE_TRANSLATIONS);
  }
}
