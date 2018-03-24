import { AfterContentChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
export class NoteComponent implements AfterContentChecked {

  @Input()
  note: NoteModel;

  @Input()
  disabled = false;

  @Output()
  readonly editionCancelled = new EventEmitter<NoteEditionEvent>();

  @Output()
  readonly editionDone = new EventEmitter<NoteEditionEvent>();

  @Output()
  readonly editionRequested = new EventEmitter<NoteModel>();

  @Output()
  readonly deletionRequested = new EventEmitter<NoteModel>();

  editedText: string;
  rowCount: number;

  private shouldGiveFocus = false;

  @ViewChild('textArea')
  private textArea: ElementRef<HTMLTextAreaElement>;

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
      this.shouldGiveFocus = true;
    } else {
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

  ngAfterContentChecked(): void {
    if (this.shouldGiveFocus && this.textArea && this.textArea.nativeElement) {
      this.textArea.nativeElement.focus();
      this.shouldGiveFocus = false;
    }
  }
}
