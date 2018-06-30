import { WeddingEventType } from './wedding-event.model';
import { Location } from './family.model';

export interface WeddingEventCommand {
  date: string;
  type: WeddingEventType;
  location: Location;
}
