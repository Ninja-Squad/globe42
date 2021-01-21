import { TestBed } from '@angular/core/testing';

import { NoteComponent, NoteEditionEvent } from './note.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, LOCALE_ID } from '@angular/core';
import { NoteCategory, NoteModel } from '../models/note.model';
import { UserModel } from '../models/user.model';
import { ComponentTester } from 'ngx-speculoos';
import { DisplayNoteCategoryPipe } from '../display-note-category.pipe';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';

@Component({
  template: `
    <gl-note
      [note]="note"
      [edited]="edited"
      [disabled]="disabled"
      (editionRequested)="noteEvent = $event"
      (editionCancelled)="editionEvent = $event; edited = false"
      (editionDone)="editionEvent = $event; edited = false"
      (deletionRequested)="deletionEvent = $event"
    >
    </gl-note>
  `
})
class TestComponent {
  note: NoteModel = {
    id: 42,
    text: 'hello world',
    creator: {
      login: 'admin'
    } as UserModel,
    creationInstant: '2017-08-09T12:01:02.000Z',
    category: 'OTHER'
  };

  noteEvent: NoteModel;
  deletionEvent: NoteModel;
  editionEvent: NoteEditionEvent;

  disabled = false;
  edited = false;
}

class NoteComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get form() {
    return this.element('form');
  }

  get edit() {
    return this.button('button');
  }

  get delete() {
    return this.elements<HTMLButtonElement>('button')[1];
  }

  get textArea() {
    return this.textarea('textarea');
  }

  categoryRadio(category: NoteCategory) {
    return this.input(`#category-${category}`);
  }

  get save() {
    return this.button('form button');
  }

  get cancel() {
    return this.elements<HTMLButtonElement>('form button')[1];
  }
}

describe('NoteComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, GlobeNgbTestingModule],
      declarations: [NoteComponent, TestComponent, DisplayNoteCategoryPipe],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });
  });

  it('should display a note, with its creator and its date', () => {
    const tester = new NoteComponentTester();
    tester.detectChanges();

    expect(tester.testElement).toContainText('admin');
    expect(tester.testElement).toContainText('9 août 2017');
    expect(tester.testElement).toContainText('hello world');
    expect(tester.testElement).toContainText('Autre');
    expect(tester.form).toBeNull();
  });

  it('should request to be edited', () => {
    const tester = new NoteComponentTester();
    tester.detectChanges();

    tester.edit.click();

    expect(tester.componentInstance.noteEvent).toBe(tester.componentInstance.note);
  });

  it('should request to be deleted', () => {
    const tester = new NoteComponentTester();
    tester.detectChanges();

    tester.delete.click();

    expect(tester.componentInstance.deletionEvent).toBe(tester.componentInstance.note);
  });

  it('should be disabled', () => {
    const tester = new NoteComponentTester();
    tester.componentInstance.disabled = true;
    tester.detectChanges();

    expect(tester.edit.disabled).toBe(true);
    expect(tester.delete.disabled).toBe(true);
  });

  it('should switch to edit mode and give the focus to the text area', () => {
    const tester = new NoteComponentTester();
    tester.componentInstance.edited = true;
    tester.detectChanges();

    expect(tester.form).toBeTruthy();
    expect(tester.textArea).toHaveValue('hello world');
    expect(tester.textArea.nativeElement.rows).toBe(2);
    expect(tester.categoryRadio('APPOINTMENT')).not.toBeChecked();
    expect(tester.categoryRadio('OTHER')).toBeChecked();
    expect(document.activeElement).toBe(tester.textArea.nativeElement);
  });

  it('should display a textarea with the right number of rows', () => {
    const tester = new NoteComponentTester();
    tester.componentInstance.edited = true;
    tester.componentInstance.note.text = 'a\nb\nc\nd';
    tester.detectChanges();

    expect(tester.textArea.nativeElement.rows).toBe(4);
  });

  it('should cancel edition', () => {
    const tester = new NoteComponentTester();
    tester.componentInstance.edited = true;
    tester.detectChanges();

    tester.textArea.fillWith('new text');

    expect(tester.componentInstance.note.text).toBe('hello world');

    tester.cancel.click();

    expect(tester.componentInstance.editionEvent).toEqual({
      id: 42,
      command: {
        text: 'new text',
        category: 'OTHER'
      }
    });
    expect(tester.testElement).toContainText('hello world');
    expect(tester.textArea).toBeFalsy();
  });

  it('should save edition', () => {
    const tester = new NoteComponentTester();
    tester.componentInstance.edited = true;
    tester.detectChanges();

    tester.textArea.fillWith('new text');
    tester.categoryRadio('APPOINTMENT').check();
    tester.save.click();

    expect(tester.componentInstance.editionEvent).toEqual({
      id: 42,
      command: {
        text: 'new text',
        category: 'APPOINTMENT'
      }
    });
  });
});
