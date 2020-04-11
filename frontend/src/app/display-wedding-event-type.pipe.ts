import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { WeddingEventType } from './models/wedding-event.model';

export const WEDDING_EVENT_TYPE_TRANSLATIONS: Array<{
  key: WeddingEventType;
  translation: string;
}> = [
  { key: 'WEDDING', translation: 'Mariage' },
  { key: 'PACS', translation: 'PACS' },
  { key: 'COHABITATION', translation: 'Concubinage' },
  { key: 'DIVORCE', translation: 'Divorce' },
  { key: 'SPOUSE_DEATH', translation: 'Décès du conjoint' },
  { key: 'SEPARATION', translation: 'Séparation' }
];

@Pipe({
  name: 'displayWeddingEventType'
})
export class DisplayWeddingEventTypePipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(WEDDING_EVENT_TYPE_TRANSLATIONS);
  }
}
