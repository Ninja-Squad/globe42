import {
  CityModel, FamilySituation, FiscalStatus, Gender, HealthCareCoverage, Housing,
  MaritalStatus
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
  firstMediationAppointmentDate: string;
  maritalStatus: MaritalStatus;
  spouseId: number;
  housing: Housing;
  housingSpace: number;
  hostName: string;
  fiscalStatus: FiscalStatus;
  fiscalStatusDate: string;
  fiscalStatusUpToDate: boolean;
  accompanying: string;
  socialSecurityNumber: string;
  cafNumber: string;
  healthCareCoverage: HealthCareCoverage;
  healthInsurance: string;
  nationalityId: string;
  frenchFamilySituation: FamilySituation;
  abroadFamilySituation: FamilySituation;
}
