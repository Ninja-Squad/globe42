import { Pipe, PipeTransform } from '@angular/core';
import { ResidencePermit } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const RESIDENCE_PERMIT_TRANSLATIONS: Record<ResidencePermit, string> = {
  UNKNOWN: 'Inconnu',
  RECEIPT_OF_APPLICATION_FOR_FIRST_RESIDENCE_PERMIT: 'Récépissé de demande de 1ère carte de séjour',
  RECEIPT_OF_RENEWAL_RESIDENCE_PERMIT: 'Récépissé de renouvellement de carte de séjour',
  RETIREMENT_RESIDENCE_PERMIT: 'Carte mention retraite',
  TEN_YEAR_OLD_RESIDENT: 'Carte de résident de 10 ans',
  TEMPORARY_RESIDENCE_PRIVATE_AND_FAMILY_LIFE: 'Carte de séjour temporaire vie privée et familiale',
  OTHER: 'Autre'
};

@Pipe({
  name: 'displayResidencePermit'
})
export class DisplayResidencePermitPipe
  extends BaseEnumPipe<ResidencePermit>
  implements PipeTransform
{
  constructor() {
    super(RESIDENCE_PERMIT_TRANSLATIONS);
  }
}
