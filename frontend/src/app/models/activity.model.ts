import { ActivityType, ActivityTypeModel } from './activity-type.model';
import { ParticipantModel } from './participant.model';

export interface ActivityModel {
  id: number;
  date: string;
  type: ActivityType;
  participants: Array<ParticipantModel>;
}

export interface Activity {
  id: number;
  date: string;
  type: ActivityTypeModel;
  participants: Array<ParticipantModel>;
}

export interface ActivityCommand {
  date: string;
  type: ActivityType;
  participantIds: Array<number>;
}
