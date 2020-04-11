import { Location } from './family.model';

export type WeddingEventType =
  | 'WEDDING'
  | 'PACS'
  | 'COHABITATION'
  | 'DIVORCE'
  | 'SPOUSE_DEATH'
  | 'SEPARATION';

export interface WeddingEventModel {
  id: number;
  date: string;
  type: WeddingEventType;
  location: Location;
}
