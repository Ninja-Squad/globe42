import { CityModel, FamilySituation, FiscalStatus, Gender, Housing, MaritalStatus } from './person.model';

export interface PersonCommand {
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
  gender: Gender;
  phoneNumber: string;
  maritalStatus: MaritalStatus,
  housing: Housing;
  housingSpace: number;
  fiscalStatus: FiscalStatus;
  fiscalStatusDate: string;
  fiscalStatusUpToDate: boolean;
  frenchFamilySituation: FamilySituation;
  abroadFamilySituation: FamilySituation;
}
