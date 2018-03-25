export type WeddingEventType = 'WEDDING' | 'DIVORCE';

export interface WeddingEventModel {
  id: number;
  date: string;
  type: WeddingEventType;
}
