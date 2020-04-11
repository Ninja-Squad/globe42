export type Location = 'FRANCE' | 'ABROAD';

export interface ChildModel {
  firstName: string;
  birthDate: string;
  location: Location;
}

export interface FamilyModel {
  spouseLocation: Location;
  children: Array<ChildModel>;
}
