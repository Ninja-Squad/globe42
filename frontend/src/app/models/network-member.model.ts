export type NetworkMemberType =
  | 'DOCTOR'
  | 'LAWYER'
  | 'PERSON_TO_WARN'
  | 'HELPER'
  | 'SOCIAL_ASSISTANT'
  | 'OTHER';

export interface NetworkMemberModel {
  id: number;
  type: NetworkMemberType;
  text: string;
}
