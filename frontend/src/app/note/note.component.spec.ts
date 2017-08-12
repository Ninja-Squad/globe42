import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteComponent, NoteEditionEvent } from './note.component';
import { FormsModule } from '@angular/forms';
import { Component, LOCALE_ID } from '@angular/core';
import { NoteModel } from '../models/note.model';
import { UserModel } from '../models/user.model';

describe('NoteComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [NoteComponent, TestComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ]
    });
  }));

  it('should display a note, with its creator and its date', () => {
    TestBed.overrideTemplate(TestComponent, '<gl-note [note]="note"></gl-note>');
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('admin');
    expect(textContent).toContain('9 août 2017');
    expect(textContent).toContain('hello world');
    expect(fixture.nativeElement.querySelector('form')).toBeFalsy();
  });

  it('should display a note without creator', () => {
    TestBed.overrideTemplate(TestComponent, '<gl-note [note]="note"></gl-note>');
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.note.creator = null;
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('9 août 2017');
    expect(textContent).toContain('hello world');
  });

  it('should request to be edited', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" (editionRequested)="noteEvent = $event"></gl-note>'
    );
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    fixture.detectChanges();
    expect(fixture.componentInstance.noteEvent).toBe(fixture.componentInstance.note);
  });

  it('should request to be deleted', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" (deletionRequested)="noteEvent = $event"></gl-note>'
    );
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('button')[1].click();

    fixture.detectChanges();
    expect(fixture.componentInstance.noteEvent).toBe(fixture.componentInstance.note);
  });

  it('should be disabled', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" [disabled]="true"></gl-note>'
    );
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('button')[0].disabled).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('button')[1].disabled).toBe(true);
  });

  it('should switch to edit mode and give the focus to the text area', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" [edited]="edited"></gl-note>'
    );

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    fixture.componentInstance.edited = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.querySelector('form')).toBeTruthy();
      const textArea: HTMLTextAreaElement = element.querySelector('textarea');
      expect(textArea.value).toBe('hello world');
      expect(textArea.rows).toBe(2);
      expect(document.activeElement).toBe(textArea);
    });
  });

  it('should display a textarea with the right number of rows', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" [edited]="true"></gl-note>'
    );

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.note.text = 'a\nb\nc\nd';
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const textArea: HTMLTextAreaElement = element.querySelector('textarea');
      expect(textArea.rows).toBe(4);
    });
  });

  it('should cancel edition', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" [edited]="edited" (editionCancelled)="editionEvent = $event; edited = false"></gl-note>'
    );

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.edited = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const textArea: HTMLTextAreaElement = element.querySelector('textarea');
      textArea.value = 'new text';
      textArea.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.note.text).toBe('hello world');

      element.querySelectorAll('button')[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.editionEvent).toEqual({
        id: 42,
        text: 'new text'
      });
      expect(element.textContent).toContain('hello world');
      expect(element.querySelector('textarea')).toBeFalsy();
    });
  });

  it('should save edition', () => {
    TestBed.overrideTemplate(
      TestComponent,
      '<gl-note [note]="note" [edited]="edited" (editionDone)="editionEvent = $event"></gl-note>'
    );

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.edited = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const textArea: HTMLTextAreaElement = element.querySelector('textarea');
      textArea.value = 'new text';
      textArea.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      element.querySelectorAll('button')[0].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.editionEvent).toEqual({
        id: 42,
        text: 'new text'
      });
    });
  });
});

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
