import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PersonModel } from '../models/person.model';
import { NoteModel } from '../models/note.model';
import { NoteEditionEvent } from '../note/note.component';
import { NoteService } from '../note.service';
import { PersonResolverService } from '../person-resolver.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { UserService } from '../user.service';
import { ConfirmService } from '../confirm.service';

@Component({
  selector: 'gl-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  person: PersonModel;
  mapsUrl: string;

  editedNote: NoteModel = null;

  constructor(private route: ActivatedRoute,
              private noteService: NoteService,
              private userService: UserService,
              private personResolver: PersonResolverService,
              private confirmService: ConfirmService) { }

  ngOnInit() {
    this.init(this.route.parent.snapshot.data['person']);
  }

  private init(person: PersonModel) {
    this.person = person;
    this.mapsUrl = this.person.city && this.person.address ? this.createMapsUrl() : null;
    this.editedNote = null;
  }

  private createMapsUrl() {
    const address = `${this.person.address} ${this.person.city.code} ${this.person.city.city}`;
    return `https://www.google.fr/maps/place/${encodeURIComponent(address)}`;
  }

  addNote() {
    this.editedNote = {
      id: null,
      text: '',
      creationInstant: moment().toISOString(),
      creator: this.userService.userEvents.getValue()
    };
    this.person.notes.push(this.editedNote);
  }

  cancelNoteEdition(event: NoteEditionEvent) {
    this.editedNote = null;
    if (!event.id) {
      this.person.notes.pop();
    }
  }

  saveNote(event: NoteEditionEvent) {
    const action =
      event.id
        ? this.noteService.update(this.person.id, event.id, event.text)
        : this.noteService.create(this.person.id, event.text);
    this.reloadAfterAction(action);
  }

  deleteNote(note: NoteModel) {
    this.confirmService.confirm({
      message: 'Voulez-vous vraiment supprimer définitivement cette note\u00a0?'
    }).subscribe(() => {
      const action = this.noteService.delete(this.person.id, note.id);
      this.reloadAfterAction(action);
    });
  }

  private reloadAfterAction(action: Observable<any>) {
    action
      .switchMap(() => this.personResolver.resolve(this.route.parent.snapshot))
      .subscribe(person => {
        this.init(person );
      });
  }
}
