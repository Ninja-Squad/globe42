export interface PersonModel {
  id: number;
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
  gender: 'male'|'female'|'other';
  phoneNumber: string;
}

export interface CityModel {
  code: number;
  city: string;
}
