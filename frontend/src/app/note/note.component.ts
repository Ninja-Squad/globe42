import { AfterContentChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NoteModel } from '../models/note.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  noteForm: FormGroup;
  rowCount: number;

  private shouldGiveFocus = false;

  @ViewChild('textArea')
  private textArea: ElementRef<HTMLTextAreaElement>;

  private _edited = false;

  constructor(private fb: FormBuilder) { }

  get edited() {
    return this._edited;
  }

  @Input()
  set edited(value) {
    if (value) {
      this.noteForm = this.fb.group({ text: [ this.note.text, Validators.required ] });
      this.rowCount = this.note.text.split('\n').length;
      if (this.rowCount < 2) {
        this.rowCount = 2;
      }
      this.shouldGiveFocus = true;
    } else {
      this.noteForm = null;
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
    this.editionCancelled.emit({id: this.note.id, text: this.noteForm.value.text});
  }

  save() {
    this.editionDone.emit({id: this.note.id, text: this.noteForm.value.text});
  }

  ngAfterContentChecked(): void {
    if (this.shouldGiveFocus && this.textArea && this.textArea.nativeElement) {
      this.textArea.nativeElement.focus();
      this.shouldGiveFocus = false;
    }
  }
}
