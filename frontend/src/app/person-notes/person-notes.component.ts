import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PersonNoteService } from '../person-note.service';
import { ConfirmService } from '../confirm.service';
import { DateTime } from 'luxon';
import { NoteModel } from '../models/note.model';
import { NoteEditionEvent } from '../note/note.component';
import { Observable, switchMap } from 'rxjs';
import { PersonModel } from '../models/person.model';
import { CurrentUserService } from '../current-user/current-user.service';

@Component({
  selector: 'gl-person-notes',
  templateUrl: './person-notes.component.html',
  styleUrls: ['./person-notes.component.scss']
})
export class PersonNotesComponent implements OnChanges {
  notes: Array<NoteModel>;

  @Input()
  person: PersonModel;

  @Output()
  readonly noteEdited = new EventEmitter<boolean>();

  spinnerDisplayed = false;

  private _editedNote: NoteModel;

  constructor(
    private personNoteService: PersonNoteService,
    private currentUserService: CurrentUserService,
    private confirmService: ConfirmService
  ) {}

  ngOnChanges(): void {
    // display the spinner after 300ms, unless the notes have loaded before. Note: delay() is untestable,
    // see https://github.com/angular/angular/issues/10127
    window.setTimeout(() => (this.spinnerDisplayed = !this.notes), 300);

    this.personNoteService.list(this.person.id).subscribe(notes => {
      this.notes = notes;
      this.spinnerDisplayed = false;
    });
  }

  get editedNote(): NoteModel {
    return this._editedNote;
  }

  set editedNote(note: NoteModel) {
    this._editedNote = note;
    this.noteEdited.emit(!!note);
  }

  addNote() {
    this.editedNote = {
      id: null,
      text: '',
      creationInstant: DateTime.utc().toISO(),
      creator: this.currentUserService.userEvents.getValue(),
      category: 'APPOINTMENT'
    };
    this.notes.unshift(this.editedNote);
  }

  cancelNoteEdition(event: NoteEditionEvent) {
    this.editedNote = null;
    if (!event.id) {
      this.notes.shift();
    }
  }

  saveNote(event: NoteEditionEvent) {
    const action = event.id
      ? this.personNoteService.update(this.person.id, event.id, event.command)
      : this.personNoteService.create(this.person.id, event.command);
    this.reloadAfterAction(action);
  }

  deleteNote(note: NoteModel) {
    this.confirmService
      .confirm({
        message: 'Voulez-vous vraiment supprimer définitivement cette note\u00a0?',
        errorOnClose: true
      })
      .subscribe(() => {
        const action = this.personNoteService.delete(this.person.id, note.id);
        this.reloadAfterAction(action);
      });
  }

  private reloadAfterAction(action: Observable<any>) {
    action.pipe(switchMap(() => this.personNoteService.list(this.person.id))).subscribe(notes => {
      this.editedNote = null;
      this.notes = notes;
    });
  }
}
