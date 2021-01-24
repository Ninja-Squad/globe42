export const NETWORK_MEMBER_TYPES = [
  'DOCTOR',
  'LAWYER',
  'PERSON_TO_WARN',
  'HELPER',
  'SOCIAL_ASSISTANT',
  'OTHER'
] as const;
export type NetworkMemberType = typeof NETWORK_MEMBER_TYPES[number];

export interface NetworkMemberModel {
  id: number;
  type: NetworkMemberType;
  text: string;
}
