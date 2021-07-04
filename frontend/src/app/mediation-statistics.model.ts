import { UserModel } from './models/user.model';
import { CountryModel } from './models/country.model';
import { PersonIdentityModel } from './models/person.model';

export interface MediationReportModel {
  appointmentCount: number;
  userAppointments: Array<UserAppointmentCountModel>;
  personAppointments: Array<PersonAppointmentCountModel>;
  averageAge: number | null;
  ageRangeAppointments: Array<AgeRangeAppointmentCountModel>;
  nationalityAppointments: Array<NationalityAppointmentCountModel>;
  averageIncomeMonthlyAmount: number | null;
}

export interface UserAppointmentCountModel {
  user: UserModel;
  count: number;
}

export interface PersonAppointmentCountModel {
  person: PersonIdentityModel;
  count: number;
}

export interface AgeRangeAppointmentCountModel {
  range: AgeRangeModel;
  count: number;
}

export interface AgeRangeModel {
  fromInclusive: number | null;
  toExclusive: number | null;
}

export interface NationalityAppointmentCountModel {
  nationality: CountryModel;
  count: number;
}
