export type MaritalStatus = 'MARRIED' |  'SINGLE' | 'CONCUBINAGE' | 'WIDOWER' | 'DIVORCED' | 'SPLIT';

export interface PersonModel {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  birthDate: string;
  mediationCode: string;
  address: string;
  city: CityModel;
  email: string;
  adherent: boolean;
  entryDate: string;
  gender: 'male'|'female'|'other';
  phoneNumber: string;
  maritalStatus: MaritalStatus
}

export interface CityModel {
  code: number;
  city: string;
}
