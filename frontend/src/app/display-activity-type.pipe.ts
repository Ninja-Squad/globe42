import { Pipe, PipeTransform } from '@angular/core';
import { ActivityType } from './models/participation.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const ACTIVITY_TYPE_TRANSLATIONS: Array<{ key: ActivityType; translation: string }> = [
  { key: 'FRENCH_AND_COMPUTER_LESSON', translation: "Cours de français et d'informatique" },
  { key: 'SOCIAL_MEDIATION', translation: 'Médiation sociale' },
  { key: 'HEALTH_MEDIATION', translation: 'Médiation santé' },
  { key: 'MEAL', translation: 'Repas' },
  { key: 'SOCIAL_RIGHTS_WORKSHOP', translation: 'Atelier droits sociaux' },
  { key: 'HEALTH_WORKSHOP', translation: 'Atelier santé' },
  { key: 'EPHEMERAL_WORKSHOP', translation: 'Atelier éphémère' },
  { key: 'VARIOUS_WORKSHOP', translation: 'Atelier divers' }
];

@Pipe({
  name: 'displayActivityType'
})
export class DisplayActivityTypePipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(ACTIVITY_TYPE_TRANSLATIONS);
  }
}
