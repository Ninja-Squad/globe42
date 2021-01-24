import { Location } from './family.model';

export const WEDDING_EVENT_TYPES = [
  'WEDDING',
  'PACS',
  'COHABITATION',
  'DIVORCE',
  'SPOUSE_DEATH',
  'SEPARATION'
] as const;
export type WeddingEventType = typeof WEDDING_EVENT_TYPES[number];

export interface WeddingEventModel {
  id: number;
  date: string;
  type: WeddingEventType;
  location: Location;
}
