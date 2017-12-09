import { PersonIdentityModel } from './person.model';

export interface ParticipantModel extends PersonIdentityModel {
  email: string;
  phoneNumber: string;
}
