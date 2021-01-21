import { Pipe, PipeTransform } from '@angular/core';
import { NoteCategory } from './models/note.model';
import { BaseEnumPipe } from './base-enum-pipe';

export const NOTE_CATEGORY_TRANSLATIONS: Array<{ key: NoteCategory; translation: string }> = [
  { key: 'APPOINTMENT', translation: 'Rendez-vous' },
  { key: 'OTHER', translation: 'Autre' }
];

@Pipe({
  name: 'displayNoteCategory'
})
export class DisplayNoteCategoryPipe extends BaseEnumPipe implements PipeTransform {
  constructor() {
    super(NOTE_CATEGORY_TRANSLATIONS);
  }
}
