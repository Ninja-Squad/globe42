import { Pipe, PipeTransform } from '@angular/core';
import { NoteCategory } from './models/note.model';
import { BaseEnumPipe } from './base-enum-pipe';

const NOTE_CATEGORY_TRANSLATIONS: Record<NoteCategory, string> = {
  APPOINTMENT: 'Rendez-vous',
  OTHER: 'Autre'
};

@Pipe({
  name: 'displayNoteCategory'
})
export class DisplayNoteCategoryPipe extends BaseEnumPipe<NoteCategory> implements PipeTransform {
  constructor() {
    super(NOTE_CATEGORY_TRANSLATIONS);
  }
}
