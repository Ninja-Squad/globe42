export type ActivityType =
  | 'FRENCH_AND_COMPUTER_LESSON_1'
  | 'FRENCH_AND_COMPUTER_LESSON_2'
  | 'FRENCH_AND_COMPUTER_LESSON_3'
  | 'FRENCH_AND_COMPUTER_LESSON_4'
  | 'SOCIAL_MEDIATION'
  | 'HEALTH_MEDIATION'
  | 'MEAL'
  | 'SOCIAL_RIGHTS_WORKSHOP'
  | 'HEALTH_WORKSHOP'
  | 'EPHEMERAL_WORKSHOP'
  | 'VARIOUS_WORKSHOP';

export interface ActivityTypeModel {
  key: ActivityType;
  name: string;
  description: string | null;
}

export const ACTIVITY_TYPES: ReadonlyArray<ActivityTypeModel> = [
  {
    key: 'FRENCH_AND_COMPUTER_LESSON_1',
    name: "Cours de français et d'informatique - groupe 1",
    description: 'niveau A1 vers A2'
  },
  {
    key: 'FRENCH_AND_COMPUTER_LESSON_2',
    name: "Cours de français et d'informatique - groupe 2",
    description: 'niveau A2 vers B1'
  },
  {
    key: 'FRENCH_AND_COMPUTER_LESSON_3',
    name: "Cours de français et d'informatique - groupe 3",
    description: 'niveau A1.1 oral'
  },
  {
    key: 'FRENCH_AND_COMPUTER_LESSON_4',
    name: "Cours de français et d'informatique - groupe 4",
    description: 'niveau A1.1 écrit'
  },
  { key: 'SOCIAL_MEDIATION', name: 'Médiation sociale', description: null },
  { key: 'HEALTH_MEDIATION', name: 'Médiation santé', description: null },
  { key: 'MEAL', name: 'Repas', description: null },
  { key: 'SOCIAL_RIGHTS_WORKSHOP', name: 'Atelier droits sociaux', description: null },
  { key: 'HEALTH_WORKSHOP', name: 'Atelier santé', description: null },
  { key: 'EPHEMERAL_WORKSHOP', name: 'Atelier éphémère', description: null },
  { key: 'VARIOUS_WORKSHOP', name: 'Atelier divers', description: null }
];

export function activityType(key: ActivityType): ActivityTypeModel {
  return ACTIVITY_TYPES.find(m => m.key === key);
}
