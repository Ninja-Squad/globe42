import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { MaritalStatus } from './models/person.model';

const MARITAL_STATUS_TRANSLATIONS: Record<MaritalStatus, string> = {
  UNKNOWN: 'Inconnu',
  MARRIED: 'Marié(e)',
  SINGLE: 'Célibataire',
  CONCUBINAGE: 'En concubinage',
  WIDOWER: 'Veuf(ve)',
  DIVORCED: 'Divorcé(e)',
  SPLIT: 'Séparé(e)'
};

@Pipe({
  name: 'displayMaritalStatus'
})
export class DisplayMaritalStatusPipe extends BaseEnumPipe<MaritalStatus> implements PipeTransform {
  constructor() {
    super(MARITAL_STATUS_TRANSLATIONS);
  }
}
