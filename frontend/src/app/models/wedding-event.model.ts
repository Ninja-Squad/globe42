import { Location } from './family.model';

export type WeddingEventType = 'WEDDING' | 'DIVORCE';

export interface WeddingEventModel {
  id: number;
  date: string;
  type: WeddingEventType;
  location: Location;
}
