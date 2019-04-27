import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NoteModel } from '../models/note.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { concat, of } from 'rxjs';

export interface NoteEditionEvent {
  id: number;
  text: string;
}

@Component({
  selector: 'gl-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements AfterViewInit {

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

  @ViewChildren('textArea')
  private textAreaQuery: QueryList<ElementRef<HTMLTextAreaElement>>;

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

  ngAfterViewInit() {
    concat(of(this.textAreaQuery), this.textAreaQuery.changes).pipe(
      filter(() => this.textAreaQuery.length === 1)
    ).subscribe(
      () => this.textAreaQuery.first.nativeElement.focus()
    );
  }
}
