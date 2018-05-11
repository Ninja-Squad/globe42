import { CountryModel } from './country.model';

export type MaritalStatus = 'UNKNOWN' | 'MARRIED' |  'SINGLE' | 'CONCUBINAGE' | 'WIDOWER' | 'DIVORCED' | 'SPLIT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type FiscalStatus = 'UNKNOWN' | 'TAXABLE' | 'NOT_TAXABLE';
export type Housing = 'UNKNOWN' | 'F0' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6';
export type HealthCareCoverage = 'UNKNOWN' | 'GENERAL' | 'PUMA' | 'AGR' | 'AME' | 'SSI' | 'OTHER';
export type HealthInsurance = 'UNKNOWN' | 'CMUC' | 'AME' | 'ACS' | 'MUTUELLE';
export type Visa = 'UNKNOWN' | 'SHORT_STAY' | 'LONG_STAY';
export type ResidencePermit ='UNKNOWN' | 'RECEIPT_OF_APPLICATION_FOR_FIRST_RESIDENCE_PERMIT' | 'RECEIPT_OF_RENEWAL_RESIDENCE_PERMIT'| 'RETIREMENT_RESIDENCE_PERMIT' | 'TEN_YEAR_OLD_RESIDENT' | 'TEMPORARY_RESIDENCE_PRIVATE_AND_FAMILY_LIFE' | 'OTHER';


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
  visa: Visa;
  residencePermit: ResidencePermit;
  residencePermitDepositDate: string;
  residencePermitRenewalDate: string;
  deleted: boolean;
}

export interface CityModel {
  code: number;
  city: string;
}
