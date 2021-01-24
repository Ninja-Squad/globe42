import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { Location } from './models/family.model';

const LOCATION_TRANSLATIONS: Record<Location, string> = {
  FRANCE: 'en France',
  ABROAD: 'au Pays'
};

@Pipe({
  name: 'displayLocation'
})
export class DisplayLocationPipe extends BaseEnumPipe<Location> implements PipeTransform {
  constructor() {
    super(LOCATION_TRANSLATIONS);
  }
}
