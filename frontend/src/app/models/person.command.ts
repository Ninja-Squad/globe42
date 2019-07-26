import {
  CityModel, FiscalStatus, Gender, HealthCareCoverage, Housing,
  MaritalStatus, Visa, ResidencePermit, EntryType
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
  visa: Visa;
  residencePermit: ResidencePermit;
  residencePermitDepositDate: string;
  residencePermitRenewalDate: string;
}
