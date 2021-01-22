import { ActivityType, ActivityTypeModel } from './activity-type.model';
import { ParticipantModel } from './participant.model';
import { PersonIdentityModel } from './person.model';

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

export interface Presence {
  person: PersonIdentityModel;
  activityCount: number;
}

export interface ActivityReport {
  totalActivityCount: number;
  presences: Array<Presence>;
}
