import { Pipe, PipeTransform } from '@angular/core';
import { SchoolLevel } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const SCHOOL_LEVEL_TRANSLATIONS: Array<{ key: SchoolLevel; translation: string }> = [
  { key: 'UNKNOWN', translation: 'Inconnue' },
  { key: 'NONE', translation: 'Aucune' },
  { key: 'PRIMARY', translation: 'Primaire' },
  { key: 'MIDDLE', translation: 'Collège' },
  { key: 'HIGH', translation: 'Lycée' },
  { key: 'HIGHER', translation: 'Études supérieures' }
];

@Pipe({
  name: 'displaySchoolLevel'
})
export class DisplaySchoolLevelPipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(SCHOOL_LEVEL_TRANSLATIONS);
  }
}
