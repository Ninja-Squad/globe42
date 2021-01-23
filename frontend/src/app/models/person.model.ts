import { CountryModel } from './country.model';

export type MaritalStatus =
  | 'UNKNOWN'
  | 'MARRIED'
  | 'SINGLE'
  | 'CONCUBINAGE'
  | 'WIDOWER'
  | 'DIVORCED'
  | 'SPLIT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type FiscalStatus = 'UNKNOWN' | 'TAXABLE' | 'NOT_TAXABLE';
export type Housing =
  | 'UNKNOWN'
  | 'NONE'
  | 'EMERGENCY'
  | 'F0'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6';
export type HealthCareCoverage =
  | 'UNKNOWN'
  | 'GENERAL'
  | 'NONE'
  | 'AGR'
  | 'AME'
  | 'CNAREFE'
  | 'PUMA'
  | 'SSI'
  | 'OTHER';
export type HealthInsurance =
  | 'UNKNOWN'
  | 'NONE'
  | 'C2S_WITHOUT_FINANCIAL_PARTICIPATION'
  | 'C2S_WITH_FINANCIAL_PARTICIPATION'
  | 'CMUC'
  | 'AME'
  | 'ACS'
  | 'MUTUELLE';
export type Visa = 'UNKNOWN' | 'NONE' | 'SHORT_STAY' | 'LONG_STAY';
export type ResidencePermit =
  | 'UNKNOWN'
  | 'RECEIPT_OF_APPLICATION_FOR_FIRST_RESIDENCE_PERMIT'
  | 'RECEIPT_OF_RENEWAL_RESIDENCE_PERMIT'
  | 'RETIREMENT_RESIDENCE_PERMIT'
  | 'TEN_YEAR_OLD_RESIDENT'
  | 'TEMPORARY_RESIDENCE_PRIVATE_AND_FAMILY_LIFE'
  | 'OTHER';
export type EntryType = 'UNKNOWN' | 'REGULAR' | 'IRREGULAR';
export type PassportStatus = 'UNKNOWN' | 'PASSPORT' | 'NO_PASSPORT';
export type SchoolLevel = 'UNKNOWN' | 'NONE' | 'PRIMARY' | 'MIDDLE' | 'HIGH' | 'HIGHER';

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
  entryType: EntryType;
  gender: Gender;
  phoneNumber: string;
  mediationEnabled: boolean;
  firstMediationAppointmentDate: string;
  maritalStatus: MaritalStatus;
  spouse: PersonIdentityModel;
  partner: string;
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
  lastHealthCheckDate: string;
  accompanying: string;
  socialSecurityNumber: string;
  cafNumber: string;
  nationality: CountryModel;
  passportStatus: PassportStatus;
  passportNumber: string;
  passportValidityStartDate: string;
  passportValidityEndDate: string;
  visa: Visa;
  residencePermit: ResidencePermit;
  residencePermitDepositDate: string;
  residencePermitRenewalDate: string;
  residencePermitValidityStartDate: string;
  residencePermitValidityEndDate: string;
  schoolLevel: SchoolLevel;
  deathDate: string;
  deleted: boolean;
}

export interface CityModel {
  code: number;
  city: string;
}

interface BaseReminder {
  type:
    | 'HEALTH_INSURANCE_TO_RENEW'
    | 'RESIDENCE_PERMIT_TO_RENEW'
    | 'HEALTH_CHECK_TO_PLAN'
    | 'MEMBERSHIP_TO_RENEW'
    | 'MEMBERSHIP_PAYMENT_OUT_OF_DATE';
}

export interface HealthInsuranceToRenew extends BaseReminder {
  type: 'HEALTH_INSURANCE_TO_RENEW';
  endDate: string;
}

export interface ResidencePermitToRenew extends BaseReminder {
  type: 'RESIDENCE_PERMIT_TO_RENEW';
  endDate: string;
}

export interface HealthCheckToPlan extends BaseReminder {
  type: 'HEALTH_CHECK_TO_PLAN';
  lastDate: string | null;
}

export interface MembershipToRenew extends BaseReminder {
  type: 'MEMBERSHIP_TO_RENEW';
}

export interface MembershipPaymentOutOfDate extends BaseReminder {
  type: 'MEMBERSHIP_PAYMENT_OUT_OF_DATE';
}

export type ReminderModel =
  | HealthInsuranceToRenew
  | ResidencePermitToRenew
  | HealthCheckToPlan
  | MembershipToRenew
  | MembershipPaymentOutOfDate;
