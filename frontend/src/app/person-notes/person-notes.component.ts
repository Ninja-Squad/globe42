import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { PersonNoteService } from '../person-note.service';
import { ConfirmService } from '../confirm.service';
import * as moment from 'moment';
import { NoteModel } from '../models/note.model';
import { NoteEditionEvent } from '../note/note.component';
import { Observable } from 'rxjs/Observable';
import { PersonModel } from '../models/person.model';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'gl-person-notes',
  templateUrl: './person-notes.component.html',
  styleUrls: ['./person-notes.component.scss']
})
export class PersonNotesComponent implements OnInit {

  notes: Array<NoteModel>;

  @Input()
  person: PersonModel;

  spinnerDisplayed = false;
  editedNote: NoteModel;

  constructor(private personNoteService: PersonNoteService,
              private userService: UserService,
              private confirmService: ConfirmService) { }

  ngOnInit(): void {
    const notes$ = this.personNoteService.list(this.person.id).share();
    // display the spinner after 300ms, unless the notes have loaded before
    Observable.of(true).delay(300).takeUntil(notes$).subscribe(() => this.spinnerDisplayed = true);
    notes$.subscribe(notes => {
      this.notes = notes;
      this.spinnerDisplayed = false;
    });
  }

  addNote() {
    this.editedNote = {
      id: null,
      text: '',
      creationInstant: moment().toISOString(),
      creator: this.userService.userEvents.getValue()
    };
    this.notes.push(this.editedNote);
  }

  cancelNoteEdition(event: NoteEditionEvent) {
    this.editedNote = null;
    if (!event.id) {
      this.notes.pop();
    }
  }

  saveNote(event: NoteEditionEvent) {
    const action =
      event.id
        ? this.personNoteService.update(this.person.id, event.id, event.text)
        : this.personNoteService.create(this.person.id, event.text);
    this.reloadAfterAction(action);
  }

  deleteNote(note: NoteModel) {
    this.confirmService.confirm({
      message: 'Voulez-vous vraiment supprimer définitivement cette note\u00a0?'
    }).subscribe(() => {
      const action = this.personNoteService.delete(this.person.id, note.id);
      this.reloadAfterAction(action);
    });
  }

  private reloadAfterAction(action: Observable<any>) {
    action
      .switchMap(() => this.personNoteService.list(this.person.id))
      .subscribe(notes => {
        this.editedNote = null;
        this.notes = notes;
      });
  }
}
