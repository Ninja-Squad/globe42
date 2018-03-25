import { WeddingEventType } from './wedding-event.model';

export interface WeddingEventCommand {
  date: string;
  type: WeddingEventType;
}
