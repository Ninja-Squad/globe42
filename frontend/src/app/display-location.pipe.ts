import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { Location } from './models/family.model';

export const LOCATION_TRANSLATIONS: Array<{ key: Location; translation: string; }> = [
  {key: 'FRANCE', translation: 'en France'},
  {key: 'ABROAD', translation: 'au Pays'}
];

@Pipe({
  name: 'displayLocation'
})
export class DisplayLocationPipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(LOCATION_TRANSLATIONS);
  }

}
