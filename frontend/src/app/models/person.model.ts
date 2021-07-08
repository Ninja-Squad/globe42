import { CountryModel } from './country.model';

export const MARITAL_STATUSES = [
  'UNKNOWN',
  'MARRIED',
  'SINGLE',
  'CONCUBINAGE',
  'WIDOWER',
  'DIVORCED',
  'SPLIT'
] as const;
export type MaritalStatus = typeof MARITAL_STATUSES[number];

export const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const;
export type Gender = typeof GENDERS[number];

export const FISCAL_STATUSES = ['UNKNOWN', 'TAXABLE', 'NOT_TAXABLE'] as const;
export type FiscalStatus = typeof FISCAL_STATUSES[number];

export const HOUSINGS = [
  'UNKNOWN',
  'NONE',
  'EMERGENCY',
  'F0',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6'
] as const;
export type Housing = typeof HOUSINGS[number];

export const HEALTH_CARE_COVERAGES = [
  'UNKNOWN',
  'GENERAL',
  'NONE',
  'AGR',
  'AME',
  'CNAREFE',
  'PUMA',
  'SSI',
  'OTHER'
] as const;
export type HealthCareCoverage = typeof HEALTH_CARE_COVERAGES[number];

export const HEALTH_INSURANCES = [
  'UNKNOWN',
  'NONE',
  'C2S_WITHOUT_FINANCIAL_PARTICIPATION',
  'C2S_WITH_FINANCIAL_PARTICIPATION',
  'CMUC',
  'AME',
  'ACS',
  'MUTUELLE'
];
export type HealthInsurance = typeof HEALTH_INSURANCES[number];

export const VISAS = ['UNKNOWN', 'NONE', 'SHORT_STAY', 'LONG_STAY'] as const;
export type Visa = typeof VISAS[number];

export const RESIDENCE_PERMITS = [
  'UNKNOWN',
  'RECEIPT_OF_APPLICATION_FOR_FIRST_RESIDENCE_PERMIT',
  'RECEIPT_OF_RENEWAL_RESIDENCE_PERMIT',
  'RETIREMENT_RESIDENCE_PERMIT',
  'TEN_YEAR_OLD_RESIDENT',
  'TEMPORARY_RESIDENCE_PRIVATE_AND_FAMILY_LIFE',
  'OTHER'
] as const;
export type ResidencePermit = typeof RESIDENCE_PERMITS[number];

export const ENTRY_TYPES = ['UNKNOWN', 'REGULAR', 'IRREGULAR'] as const;
export type EntryType = typeof ENTRY_TYPES[number];

export const PASSPORT_STATUSES = ['UNKNOWN', 'PASSPORT', 'NO_PASSPORT'] as const;
export type PassportStatus = typeof PASSPORT_STATUSES[number];

export const SCHOOL_LEVELS = ['UNKNOWN', 'NONE', 'PRIMARY', 'MIDDLE', 'HIGH', 'HIGHER'] as const;
export type SchoolLevel = typeof SCHOOL_LEVELS[number];

export interface PersonIdentityModel {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  mediationCode: string;
  email: string;
  phoneNumber: string;
}

export interface PersonModel extends PersonIdentityModel {
  birthName: string;
  birthDate: string;
  address: string;
  city: CityModel;
  entryDate: string;
  entryType: EntryType;
  gender: Gender;
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

export const REMINDER_TYPES = [
  'HEALTH_INSURANCE_TO_RENEW',
  'RESIDENCE_PERMIT_TO_RENEW',
  'HEALTH_CHECK_TO_PLAN',
  'MEMBERSHIP_TO_RENEW',
  'MEMBERSHIP_PAYMENT_OUT_OF_DATE'
] as const;
export type ReminderType = typeof REMINDER_TYPES[number];

interface BaseReminder {
  type: ReminderType;
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

export interface PersonWithRemindersModel extends PersonIdentityModel {
  email: string;
  phoneNumber: string;
  reminders: Array<ReminderModel>;
}
