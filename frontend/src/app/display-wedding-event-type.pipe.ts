import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { WeddingEventType } from './models/wedding-event.model';

const WEDDING_EVENT_TYPE_TRANSLATIONS: Record<WeddingEventType, string> = {
  WEDDING: 'Mariage',
  PACS: 'PACS',
  COHABITATION: 'Concubinage',
  DIVORCE: 'Divorce',
  SPOUSE_DEATH: 'Décès du conjoint',
  SEPARATION: 'Séparation'
};

@Pipe({
  name: 'displayWeddingEventType'
})
export class DisplayWeddingEventTypePipe
  extends BaseEnumPipe<WeddingEventType>
  implements PipeTransform
{
  constructor() {
    super(WEDDING_EVENT_TYPE_TRANSLATIONS);
  }
}
