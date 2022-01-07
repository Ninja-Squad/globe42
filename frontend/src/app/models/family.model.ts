export const LOCATIONS = ['FRANCE', 'ABROAD'] as const;
export type Location = typeof LOCATIONS[number];

export interface RelativeModel {
  type: 'CHILD' | 'BROTHER' | 'SISTER';
  firstName: string;
  birthDate: string;
  location: Location;
}

export interface FamilyModel {
  spouseLocation: Location;
  relatives: Array<RelativeModel>;
}
