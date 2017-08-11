import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NoteModel } from '../models/note.model';

export interface NoteEditionEvent {
  id: number;
  text: string;
}

@Component({
  selector: 'gl-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {

  @Input()
  note: NoteModel;

  @Input()
  position: 'left' | 'right' = 'left';

  @Input()
  disabled = false;

  @Output()
  editionCancelled = new EventEmitter<NoteEditionEvent>();

  @Output()
  editionDone = new EventEmitter<NoteEditionEvent>();

  @Output()
  editionRequested = new EventEmitter<NoteModel>();

  @Output()
  deletionRequested = new EventEmitter<NoteModel>();

  editedText: string;
  rowCount: number;

  private _edited = false;

  get edited() {
    return this._edited;
  }

  @Input()
  set edited(value) {
    if (value) {
      this.editedText = this.note.text;
      this.rowCount = this.editedText.split('\n').length;
      if (this.rowCount < 2) {
        this.rowCount = 2;
      }
    }
    else {
      this.editedText = null;
    }
    this._edited = value;
  }

  edit() {
    this.editionRequested.emit(this.note);
  }

  delete() {
    this.deletionRequested.emit(this.note);
  }

  cancel() {
    this.editionCancelled.emit({id: this.note.id, text: this.editedText});
  }

  save() {
    this.editionDone.emit({id: this.note.id, text: this.editedText});
  }
}
