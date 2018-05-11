import { CountryModel } from './country.model';

export type MaritalStatus = 'UNKNOWN' | 'MARRIED' |  'SINGLE' | 'CONCUBINAGE' | 'WIDOWER' | 'DIVORCED' | 'SPLIT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type FiscalStatus = 'UNKNOWN' | 'TAXABLE' | 'NOT_TAXABLE';
export type Housing = 'UNKNOWN' | 'F0' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6';
export type HealthCareCoverage = 'UNKNOWN' | 'GENERAL' | 'PUMA' | 'AGR' | 'AME' | 'SSI' | 'OTHER';
export type HealthInsurance = 'UNKNOWN' | 'CMUC' | 'AME' | 'ACS' | 'MUTUELLE';

export interface PersonIdentityModel {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  mediationCode: string;
}

export interface PersonModel extends PersonIdentityModel {
  birthName: string;
  birthDate: string;
  address: string;
  city: CityModel;
  email: string;
  entryDate: string;
  gender: Gender;
  phoneNumber: string;
  mediationEnabled: boolean;
  firstMediationAppointmentDate: string;
  maritalStatus: MaritalStatus;
  spouse: PersonIdentityModel;
  housing: Housing;
  housingSpace: number;
  hostName: string;
  fiscalStatus: FiscalStatus;
  fiscalNumber: string;
  fiscalStatusUpToDate: boolean;
  healthCareCoverage: HealthCareCoverage;
  healthCareCoverageStartDate: string;
  healthInsurance: HealthInsurance;
  healthInsuranceStartDate: string;
  accompanying: string;
  socialSecurityNumber: string;
  cafNumber: string;
  nationality: CountryModel;
  deleted: boolean;
}

export interface CityModel {
  code: number;
  city: string;
}
