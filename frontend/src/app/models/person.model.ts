export type MaritalStatus = 'MARRIED' |  'SINGLE' | 'CONCUBINAGE' | 'WIDOWER' | 'DIVORCED' | 'SPLIT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type FiscalStatus = 'TAXABLE' | 'NOT_TAXABLE';

export interface PersonIdentityModel {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  mediationCode: string;
}

export interface FamilySituation {
  parentsPresent: boolean;
  spousePresent: boolean;
  childCount: number;
  siblingCount: number;
}

export interface PersonModel extends PersonIdentityModel {
  birthDate: string;
  address: string;
  city: CityModel;
  email: string;
  adherent: boolean;
  entryDate: string;
  gender: Gender;
  phoneNumber: string;
  maritalStatus: MaritalStatus;
  housing: string;
  housingSpace: number;
  fiscalStatus: FiscalStatus;
  fiscalStatusDate: string;
  fiscalStatusUpToDate: boolean;
  frenchFamilySituation: FamilySituation;
  abroadFamilySituation: FamilySituation;
}

export interface CityModel {
  code: number;
  city: string;
}
