import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { WeddingEventType } from './models/wedding-event.model';

export const WEDDING_EVENT_TYPE_TRANSLATIONS: Array<{ key: WeddingEventType; translation: string; }> = [
  {key: 'WEDDING', translation: 'Mariage'},
  {key: 'DIVORCE', translation: 'Divorce'}
];

@Pipe({
  name: 'displayWeddingEventType'
})
export class DisplayWeddingEventTypePipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(WEDDING_EVENT_TYPE_TRANSLATIONS);
  }
}
