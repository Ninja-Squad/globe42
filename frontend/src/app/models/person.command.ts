import {
  CityModel, FiscalStatus, Gender, HealthCareCoverage, Housing,
  MaritalStatus, Visa, ResidencePermit, EntryType, PassportStatus
} from './person.model';

export interface PersonCommand {
  firstName: string;
  lastName: string;
  birthName: string;
  nickName: string;
  birthDate: string;
  mediationCode: string;
  address: string;
  city: CityModel;
  email: string;
  gender: Gender;
  adherent: boolean;
  phoneNumber: string;
  mediationEnabled: boolean;
  entryDate: string;
  entryType: EntryType;
  firstMediationAppointmentDate: string;
  maritalStatus: MaritalStatus;
  spouseId: number;
  partner: string;
  housing: Housing;
  housingSpace: number;
  hostName: string;
  fiscalStatus: FiscalStatus;
  fiscalNumber: string;
  fiscalStatusUpToDate: boolean;
  accompanying: string;
  socialSecurityNumber: string;
  cafNumber: string;
  healthCareCoverage: HealthCareCoverage;
  healthCareCoverageStartDate: string;
  healthInsurance: string;
  healthInsuranceStartDate: string;
  nationalityId: string;
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
}

export interface PersonDeathCommand {
  deathDate: string;
}
