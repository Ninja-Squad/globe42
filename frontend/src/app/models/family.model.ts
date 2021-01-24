export const LOCATIONS = ['FRANCE', 'ABROAD'] as const;
export type Location = typeof LOCATIONS[number];

export interface ChildModel {
  firstName: string;
  birthDate: string;
  location: Location;
}

export interface FamilyModel {
  spouseLocation: Location;
  children: Array<ChildModel>;
}
