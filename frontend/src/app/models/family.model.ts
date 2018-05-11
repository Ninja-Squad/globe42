export type Location = 'FRANCE' | 'ABROAD';

export interface ChildModel {
  firstName: string;
  birthDate: string;
  location: Location;
}

export interface FamilyModel {
  parentInFrance: boolean;
  parentAbroad: boolean;
  spouseLocation: Location;
  children: Array<ChildModel>;
}

