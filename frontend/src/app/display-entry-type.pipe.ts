import { Pipe, PipeTransform } from '@angular/core';
import { EntryType } from './models/person.model';
import { BaseEnumPipe } from './base-enum-pipe';

const ENTRY_TYPE_TRANSLATIONS: Record<EntryType, string> = {
  UNKNOWN: 'Inconnue',
  REGULAR: 'Régulière',
  IRREGULAR: 'Irrégulière'
};

@Pipe({
  name: 'displayEntryType'
})
export class DisplayEntryTypePipe extends BaseEnumPipe<EntryType> implements PipeTransform {
  constructor() {
    super(ENTRY_TYPE_TRANSLATIONS);
  }
}
