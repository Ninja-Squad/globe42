import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PersonNotesComponent } from './person-notes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoteComponent } from '../note/note.component';
import { PersonNoteService } from '../person-note.service';
import { PersonModel } from '../models/person.model';
import { NoteModel } from '../models/note.model';
import { ConfirmService } from '../confirm.service';
import { EMPTY, of, Subject } from 'rxjs';
import { UserModel } from '../models/user.model';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { ComponentTester } from 'ngx-speculoos';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DisplayNoteCategoryPipe } from '../display-note-category.pipe';

@Component({
  template: '<gl-person-notes [person]="person"></gl-person-notes>'
})
class TestComponent {
  person: PersonModel;
}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get spinner() {
    return this.element('.fa-spinner');
  }

  get notes() {
    return this.elements(NoteComponent);
  }

  get noteComponents() {
    return this.components(NoteComponent);
  }

  editNote(index: number) {
    return this.notes[index].button('button');
  }

  deleteNote(index: number) {
    return this.notes[index].elements<HTMLButtonElement>('button')[1];
  }

  saveNote(index: number) {
    return this.notes[index].button('form button');
  }

  cancelNoteEdition(index: number) {
    return this.notes[index].elements<HTMLButtonElement>('form button')[1];
  }

  get addNote() {
    return this.button('#addNote');
  }

  get notesComponentInstance(): PersonNotesComponent {
    return this.debugElement.query(By.directive(PersonNotesComponent)).componentInstance;
  }
}

describe('PersonNotesComponent', () => {
  const person = { id: 42 } as PersonModel;
  let notes: Array<NoteModel>;

  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CurrentUserModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule,
        GlobeNgbTestingModule
      ],
      declarations: [PersonNotesComponent, NoteComponent, TestComponent, DisplayNoteCategoryPipe]
    });

    notes = [
      {
        id: 1,
        text: 'note 1',
        creator: {
          id: 1,
          login: 'admin'
        } as UserModel,
        creationInstant: '2017-08-09T12:00:00.000Z',
        category: 'APPOINTMENT'
      },
      {
        id: 2,
        text: 'note 2',
        creator: {
          id: 1,
          login: 'admin'
        } as UserModel,
        creationInstant: '2017-08-10T12:00:00.000Z',
        category: 'OTHER'
      }
    ];

    const userService = TestBed.inject(CurrentUserService);
    userService.userEvents.next({ login: 'admin' } as UserModel);

    tester = new TestComponentTester();
  });

  it('should display notes', () => {
    const personNoteService = TestBed.inject(PersonNoteService);
    spyOn(personNoteService, 'list').and.returnValue(of(notes));

    tester.componentInstance.person = person;
    tester.detectChanges();

    expect(tester.testElement).not.toContainText('Aucune note');
    expect(tester.notes.length).toBe(2);
  });

  it('should refetch notes when the person change', () => {
    const personNoteService = TestBed.inject(PersonNoteService);
    spyOn(personNoteService, 'list').and.returnValues(of([]), of(notes));

    tester.componentInstance.person = person;
    tester.detectChanges();

    expect(tester.testElement).toContainText('Aucune note');
    expect(tester.notes.length).toBe(0);

    tester.componentInstance.person = { id: 43 } as PersonModel;
    tester.detectChanges();
    expect(tester.testElement).not.toContainText('Aucune note');
    expect(tester.notes.length).toBe(2);
  });

  it('should display no note message if no notes', () => {
    const personNoteService = TestBed.inject(PersonNoteService);
    spyOn(personNoteService, 'list').and.returnValue(of([]));

    tester.componentInstance.person = person;
    tester.detectChanges();

    expect(tester.testElement).toContainText('Aucune note');
  });

  it('should display a spinner after 300 ms until notes are available', fakeAsync(() => {
    const personNoteService = TestBed.inject(PersonNoteService);
    const subject = new Subject<Array<NoteModel>>();
    spyOn(personNoteService, 'list').and.returnValue(subject);

    tester.componentInstance.person = person;
    tester.detectChanges();
    tick();

    expect(tester.spinner).toBeNull();

    tick(350);
    tester.detectChanges();
    expect(tester.spinner).not.toBeNull();

    subject.next(notes);
    tester.detectChanges();
    expect(tester.spinner).toBeNull();
  }));

  it('should disable other notes when editing one', () => {
    // create component with 2 notes
    const personNoteService = TestBed.inject(PersonNoteService);
    spyOn(personNoteService, 'list').and.returnValue(of(notes));

    tester.componentInstance.person = person;
    const noteEditedObserver = jasmine.createSpy('noteEditedObserver');
    tester.notesComponentInstance.noteEdited.subscribe(noteEditedObserver);
    tester.detectChanges();

    tester.editNote(0).click();

    expect(tester.notesComponentInstance.editedNote).toBe(notes[0]);
    expect(tester.noteComponents[0].edited).toBe(true);
    expect(tester.noteComponents[1].disabled).toBe(true);
    expect(noteEditedObserver).toHaveBeenCalledWith(true);

    tester.cancelNoteEdition(0).click();

    expect(tester.notesComponentInstance.editedNote).toBeNull();
    expect(tester.noteComponents[0].edited).toBe(false);
    expect(noteEditedObserver).toHaveBeenCalledWith(false);
    expect(tester.noteComponents[1].disabled).toBe(false);
  });

  it('should delete note', () => {
    // create component with 2 notes
    const personNoteService = TestBed.inject(PersonNoteService);
    const confirmService = TestBed.inject(ConfirmService);
    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(personNoteService, 'delete').and.returnValue(of(null));
    spyOn(personNoteService, 'list').and.returnValues(of(notes), of([notes[1]]));

    tester.componentInstance.person = person;
    tester.detectChanges();

    // delete first note and confirm
    tester.deleteNote(0).click();

    expect(personNoteService.delete).toHaveBeenCalledWith(person.id, notes[0].id);
    expect(personNoteService.list).toHaveBeenCalledWith(person.id);

    expect(tester.notes.length).toBe(1);
  });

  it('should not delete note if not confirmed', () => {
    // create component with 2 notes
    const personNoteService = TestBed.inject(PersonNoteService);
    const confirmService = TestBed.inject(ConfirmService);
    spyOn(personNoteService, 'list').and.returnValue(of(notes));
    spyOn(personNoteService, 'delete').and.returnValue(of(null));
    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);

    tester.componentInstance.person = person;
    tester.detectChanges();

    // delete first note and don't confirm
    tester.deleteNote(0).click();

    expect(personNoteService.delete).not.toHaveBeenCalled();
    expect(tester.notes.length).toBe(2);
  });

  it('should update note', () => {
    // create component with 2 notes
    const personNoteService = TestBed.inject(PersonNoteService);
    spyOn(personNoteService, 'update').and.returnValue(of(null));
    spyOn(personNoteService, 'list').and.returnValues(of(notes), of(notes));

    tester.componentInstance.person = person;
    tester.detectChanges();

    // edit first note
    tester.editNote(0).click();

    // change first note text
    tester.notes[0].textarea('textarea').fillWith('new text');

    expect(tester.noteComponents[0].noteForm.value.text).toBe('new text');

    // save the change
    tester.saveNote(0).click();

    expect(personNoteService.update).toHaveBeenCalledWith(person.id, notes[0].id, {
      text: 'new text',
      category: 'APPOINTMENT'
    });
    expect(personNoteService.list).toHaveBeenCalledWith(person.id);

    expect(tester.notes.length).toBe(2);
  });

  it('should add a note at the beginning when creating, and remove it when cancelling', () => {
    // create component with 2 notes
    const personNoteService = TestBed.inject(PersonNoteService);
    spyOn(personNoteService, 'update').and.returnValue(of(null));
    spyOn(personNoteService, 'list').and.returnValue(of(notes));

    tester.componentInstance.person = person;
    const noteEditedObserver = jasmine.createSpy('noteEditedObserver');
    tester.notesComponentInstance.noteEdited.subscribe(noteEditedObserver);
    tester.detectChanges();

    tester.addNote.click();

    expect(tester.notes.length).toBe(3);

    expect(tester.notesComponentInstance.editedNote).toBe(notes[0]);
    expect(notes[0].text).toBe('');
    expect(notes[0].category).toBe('APPOINTMENT');
    expect(tester.noteComponents[1].disabled).toBe(true);
    expect(tester.noteComponents[2].disabled).toBe(true);
    expect(tester.noteComponents[0].edited).toBe(true);
    expect(tester.addNote.disabled).toBe(true);
    expect(tester.notes[0]).toContainText('admin');

    // cancel the edition
    tester.cancelNoteEdition(0).click();
    expect(tester.notesComponentInstance.editedNote).toBeNull();
    expect(noteEditedObserver).toHaveBeenCalledWith(false);

    expect(tester.notes.length).toBe(2);
    expect(tester.noteComponents[0].disabled).toBe(false);
    expect(tester.noteComponents[1].disabled).toBe(false);
  });

  it('should create a note', () => {
    // create component with 2 notes
    const newNote: NoteModel = {
      id: 3,
      text: 'new text',
      creator: {
        id: 1,
        login: 'admin'
      } as UserModel,
      creationInstant: '2017-08-11T12:00:00.000Z',
      category: 'APPOINTMENT'
    };

    const personNoteService = TestBed.inject(PersonNoteService);
    spyOn(personNoteService, 'create').and.returnValue(of(newNote));
    spyOn(personNoteService, 'list').and.returnValues(of(notes), of([newNote, notes[0], notes[1]]));

    tester.componentInstance.person = person;
    const noteEditedObserver = jasmine.createSpy('noteEditedObserver');
    tester.notesComponentInstance.noteEdited.subscribe(noteEditedObserver);
    tester.detectChanges();

    tester.addNote.click();

    expect(noteEditedObserver).toHaveBeenCalledWith(true);

    // enter text of new note
    tester.notes[0].textarea('textarea').fillWith('new text');
    expect(tester.noteComponents[0].noteForm.value.text).toBe('new text');

    // save new note
    tester.saveNote(0).click();

    expect(personNoteService.create).toHaveBeenCalledWith(person.id, {
      text: 'new text',
      category: 'APPOINTMENT'
    });
    expect(personNoteService.list).toHaveBeenCalledWith(person.id);

    tester.detectChanges();
    expect(tester.notes.length).toBe(3);
    expect(tester.notesComponentInstance.editedNote).toBe(null);
    expect(noteEditedObserver).toHaveBeenCalledWith(false);
  });
});
