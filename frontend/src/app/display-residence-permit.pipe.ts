import { Pipe, PipeTransform } from '@angular/core';
import { ResidencePermit } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const RESIDENCE_PERMIT_TRANSLATIONS: Array<{ key: ResidencePermit; translation: string }> = [
  { key: 'UNKNOWN', translation: 'Inconnu' },
  {
    key: 'RECEIPT_OF_APPLICATION_FOR_FIRST_RESIDENCE_PERMIT',
    translation: 'Récépissé de demande de 1ère carte de séjour'
  },
  {
    key: 'RECEIPT_OF_RENEWAL_RESIDENCE_PERMIT',
    translation: 'Récépissé de renouvellement de carte de séjour'
  },
  { key: 'RETIREMENT_RESIDENCE_PERMIT', translation: 'Carte mention retraite' },
  { key: 'TEN_YEAR_OLD_RESIDENT', translation: 'Carte de résident de 10 ans' },
  {
    key: 'TEMPORARY_RESIDENCE_PRIVATE_AND_FAMILY_LIFE',
    translation: 'Carte de séjour temporaire vie privée et familiale'
  },
  { key: 'OTHER', translation: 'Autre' }
];

@Pipe({
  name: 'displayResidencePermit'
})
export class DisplayResidencePermitPipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(RESIDENCE_PERMIT_TRANSLATIONS);
  }
}
