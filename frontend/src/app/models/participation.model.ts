export type ActivityType =
  | 'FRENCH_AND_COMPUTER_LESSON'
  | 'SOCIAL_MEDIATION'
  | 'HEALTH_MEDIATION'
  | 'MEAL'
  | 'SOCIAL_RIGHTS_WORKSHOP'
  | 'HEALTH_WORKSHOP'
  | 'EPHEMERAL_WORKSHOP'
  | 'VARIOUS_WORKSHOP';

export interface ParticipationModel {
  id: number;
  activityType: ActivityType;
}
