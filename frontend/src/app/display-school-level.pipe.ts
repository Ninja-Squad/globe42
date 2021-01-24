import { Pipe, PipeTransform } from '@angular/core';
import { SchoolLevel } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const SCHOOL_LEVEL_TRANSLATIONS: Record<SchoolLevel, string> = {
  UNKNOWN: 'Inconnue',
  NONE: 'Aucune',
  PRIMARY: 'Primaire',
  MIDDLE: 'Collège',
  HIGH: 'Lycée',
  HIGHER: 'Études supérieures'
};

@Pipe({
  name: 'displaySchoolLevel'
})
export class DisplaySchoolLevelPipe extends BaseEnumPipe<SchoolLevel> implements PipeTransform {
  constructor() {
    super(SCHOOL_LEVEL_TRANSLATIONS);
  }
}
