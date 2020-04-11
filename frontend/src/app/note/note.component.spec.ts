import { async, TestBed } from '@angular/core/testing';

import { NoteComponent, NoteEditionEvent } from './note.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, LOCALE_ID } from '@angular/core';
import { NoteModel } from '../models/note.model';
import { UserModel } from '../models/user.model';
import { ComponentTester, speculoosMatchers, TestButton } from 'ngx-speculoos';

@Component({
  template: ''
})
class TestComponent {
  note: NoteModel = {
    id: 42,
    text: 'hello world',
    creator: {
      login: 'admin'
    } as UserModel,
    creationInstant: '2017-08-09T12:01:02.000Z'
  };

  noteEvent: NoteModel;
  editionEvent: NoteEditionEvent;

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
    return this.elements('button')[1] as TestButton;
  }

  get textArea() {
    return this.textarea('textarea');
  }

  get save() {
    return this.button('form button');
  }

  get cancel() {
    return this.elements('form button')[1] as TestButton;
  }
}

describe('NoteComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [NoteComponent, TestComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });

    jasmine.addMatchers(speculoosMatchers);
  }));

  it('should display a note, with its creator and its date', () => {
    TestBed.overrideTemplate(TestComponent, '<gl-note [note]="note"></gl-note>');
    const tester = new NoteComponentTester();
    tester.detectChanges();

    expect(tester.testElement).toContainText('admin');
    expect(tester.testElement).toContainText('9 août 2017');
    expect(tester.testElement).toContainText('hello world');
    expect(tester.form).toBeNull();
  });

  it('should request to be edited', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" (editionRequested)="noteEvent = $event"></gl-note>'
    );
    const tester = new NoteComponentTester();
    tester.detectChanges();

    tester.edit.click();

    expect(tester.componentInstance.noteEvent).toBe(tester.componentInstance.note);
  });

  it('should request to be deleted', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" (deletionRequested)="noteEvent = $event"></gl-note>'
    );
    const tester = new NoteComponentTester();
    tester.detectChanges();

    tester.delete.click();

    expect(tester.componentInstance.noteEvent).toBe(tester.componentInstance.note);
  });

  it('should be disabled', () => {
    TestBed.overrideTemplate(TestComponent, '<gl-note [note]="note" [disabled]="true"></gl-note>');
    const tester = new NoteComponentTester();
    tester.detectChanges();

    expect(tester.edit.disabled).toBe(true);
    expect(tester.delete.disabled).toBe(true);
  });

  it('should switch to edit mode and give the focus to the text area', async(() => {
    TestBed.overrideTemplate(TestComponent, '<gl-note [note]="note" [edited]="edited"></gl-note>');

    const tester = new NoteComponentTester();
    tester.componentInstance.edited = true;
    tester.detectChanges();

    tester.fixture.whenStable().then(() => {
      tester.detectChanges();

      expect(tester.form).toBeTruthy();
      expect(tester.textArea).toHaveValue('hello world');
      expect(tester.textArea.nativeElement.rows).toBe(2);
      expect(document.activeElement).toBe(tester.textArea.nativeElement);
    });
  }));

  it('should display a textarea with the right number of rows', () => {
    TestBed.overrideTemplate(TestComponent, '<gl-note [note]="note" [edited]="true"></gl-note>');

    const tester = new NoteComponentTester();
    tester.componentInstance.note.text = 'a\nb\nc\nd';
    tester.detectChanges();

    expect(tester.textArea.nativeElement.rows).toBe(4);
  });

  it('should cancel edition', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" [edited]="edited" (editionCancelled)="editionEvent = $event; edited = false"></gl-note>'
    );

    const tester = new NoteComponentTester();
    tester.componentInstance.edited = true;
    tester.detectChanges();

    tester.textArea.fillWith('new text');

    expect(tester.componentInstance.note.text).toBe('hello world');

    tester.cancel.click();

    expect(tester.componentInstance.editionEvent).toEqual({
      id: 42,
      text: 'new text'
    });
    expect(tester.testElement).toContainText('hello world');
    expect(tester.textArea).toBeFalsy();
  });

  it('should save edition', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" [edited]="edited" (editionDone)="editionEvent = $event"></gl-note>'
    );

    const tester = new NoteComponentTester();
    tester.componentInstance.edited = true;
    tester.detectChanges();

    tester.textArea.fillWith('new text');
    tester.save.click();

    expect(tester.componentInstance.editionEvent).toEqual({
      id: 42,
      text: 'new text'
    });
  });
});
