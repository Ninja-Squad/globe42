import { Pipe, PipeTransform } from '@angular/core';
import { EntryType } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const ENTRY_TYPE_TRANSLATIONS: Array<{ key: EntryType; translation: string; }> = [
  {key: 'UNKNOWN', translation: 'Inconnue'},
  {key: 'REGULAR', translation: 'Régulière'},
  {key: 'IRREGULAR', translation: 'Irrégulière'}
];

@Pipe({
  name: 'displayEntryType'
})
export class DisplayEntryTypePipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(ENTRY_TYPE_TRANSLATIONS);
  }
}
