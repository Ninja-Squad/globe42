import { ActivityType, ActivityTypeModel } from './activity-type.model';
import { PersonIdentityModel } from './person.model';

export interface ActivityModel {
  id: number;
  date: string;
  type: ActivityType;
  participants: Array<PersonIdentityModel>;
}

export interface Activity {
  id: number;
  date: string;
  type: ActivityTypeModel;
  participants: Array<PersonIdentityModel>;
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
