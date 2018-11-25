import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { ComponentTester, speculoosMatchers, TestButton, TestHtmlElement } from 'ngx-speculoos';

class PersonNotesComponentTester extends ComponentTester<PersonNotesComponent> {
  constructor() {
    super(PersonNotesComponent);
  }

  get spinner() {
    return this.element('.fa-spinner');
  }

  get notes() {
    return this.elements('gl-note') as Array<TestHtmlElement<HTMLElement>>;
  }

  get noteComponents() {
    return this.notes.map(note => note.debugElement.componentInstance as NoteComponent);
  }

  editNote(index: number) {
    return this.notes[index].button('button');
  }

  deleteNote(index: number) {
    return this.notes[index].elements('button')[1] as TestButton;
  }

  saveNote(index: number) {
    return this.notes[index].button('form button');
  }

  cancelNoteEdition(index: number) {
    return this.notes[index].elements('form button')[1] as TestButton ;
  }

  get addNote() {
    return this.button('#addNote');
  }
}

describe('PersonNotesComponent', () => {

  const person = { id: 42 } as PersonModel;
  let notes: Array<NoteModel>;

  let tester: PersonNotesComponentTester;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), ReactiveFormsModule, HttpClientModule, GlobeNgbModule.forRoot()],
      declarations: [PersonNotesComponent, NoteComponent]
    });

    notes = [
      {
        id: 1,
        text: 'note 1',
        creator: {
          id: 1,
          login: 'admin'
        } as UserModel,
        creationInstant: '2017-08-09T12:00:00.000Z'
      },
      {
        id: 2,
        text: 'note 2',
        creator: {
          id: 1,
          login: 'admin'
        } as UserModel,
        creationInstant: '2017-08-10T12:00:00.000Z'
      }
    ];

    const userService = TestBed.get(CurrentUserService);
    userService.userEvents.next({ login: 'admin' } as UserModel);

    tester = new PersonNotesComponentTester();

    jasmine.addMatchers(speculoosMatchers);
  }));

  it('should display notes', () => {
    const personNoteService = TestBed.get(PersonNoteService);
    spyOn(personNoteService, 'list').and.returnValue(of(notes));

    tester.componentInstance.person = person;
    tester.detectChanges();

    expect(tester.testElement).not.toContainText('Aucune note');
    expect(tester.notes.length).toBe(2);
  });

  it('should display no note message if no notes', () => {
    const personNoteService = TestBed.get(PersonNoteService);
    spyOn(personNoteService, 'list').and.returnValue(of([]));

    tester.componentInstance.person = person;
    tester.detectChanges();

    expect(tester.testElement).toContainText('Aucune note');
  });

  it('should display a spinner after 300 ms until notes are available', fakeAsync(() => {
    const personNoteService = TestBed.get(PersonNoteService);
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
    const personNoteService = TestBed.get(PersonNoteService);
    spyOn(personNoteService, 'list').and.returnValue(of(notes));

    tester.componentInstance.person = person;
    const noteEditedObserver = jasmine.createSpy('noteEditedObserver');
    tester.componentInstance.noteEdited.subscribe(noteEditedObserver);
    tester.detectChanges();

    tester.editNote(0).click();

    expect(tester.componentInstance.editedNote).toBe(notes[0]);
    expect(tester.noteComponents[0].edited).toBe(true);
    expect(tester.noteComponents[1].disabled).toBe(true);
    expect(noteEditedObserver).toHaveBeenCalledWith(true);

    tester.cancelNoteEdition(0).click();

    expect(tester.componentInstance.editedNote).toBeNull();
    expect(tester.noteComponents[0].edited).toBe(false);
    expect(noteEditedObserver).toHaveBeenCalledWith(false);
    expect(tester.noteComponents[1].disabled).toBe(false);
  });

  it('should delete note', () => {
    // create component with 2 notes
    const personNoteService = TestBed.get(PersonNoteService);
    const confirmService = TestBed.get(ConfirmService);
    spyOn(confirmService, 'confirm').and.returnValue(of('ok'));
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
    const personNoteService = TestBed.get(PersonNoteService);
    const confirmService = TestBed.get(ConfirmService);
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
    const personNoteService = TestBed.get(PersonNoteService);
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

    expect(personNoteService.update).toHaveBeenCalledWith(person.id, notes[0].id, 'new text');
    expect(personNoteService.list).toHaveBeenCalledWith(person.id);

    expect(tester.notes.length).toBe(2);
  });

  it('should add a note at the end when creating, and remove it when cancelling', () => {
    // create component with 2 notes
    const personNoteService = TestBed.get(PersonNoteService);
    spyOn(personNoteService, 'update').and.returnValue(of(null));
    spyOn(personNoteService, 'list').and.returnValue(of(notes));

    tester.componentInstance.person = person;
    const noteEditedObserver = jasmine.createSpy('noteEditedObserver');
    tester.componentInstance.noteEdited.subscribe(noteEditedObserver);
    tester.detectChanges();

    tester.addNote.click();

    expect(tester.notes.length).toBe(3);

    expect(tester.componentInstance.editedNote).toBe(notes[2]);
    expect(tester.noteComponents[0].disabled).toBe(true);
    expect(tester.noteComponents[1].disabled).toBe(true);
    expect(tester.noteComponents[2].edited).toBe(true);
    expect(tester.addNote.disabled).toBe(true);
    expect(tester.notes[2]).toContainText('admin');

    // cancel the edition
    tester.cancelNoteEdition(2).click();
    expect(tester.componentInstance.editedNote).toBeNull();
    expect(noteEditedObserver).toHaveBeenCalledWith(false);

    expect(tester.notes.length).toBe(2);
    expect(tester.noteComponents[0].disabled).toBe(false);
    expect(tester.noteComponents[1].disabled).toBe(false);
  });

  it('should create a note', () => {
    // create component with 2 notes
    const newNote = {
      id: 3,
      text: 'new text',
      creator: {
        id: 1,
        login: 'admin'
      } as UserModel,
      creationInstant: '2017-08-11T12:00:00.000Z'
    };

    const personNoteService = TestBed.get(PersonNoteService);
    spyOn(personNoteService, 'create').and.returnValue(of(newNote));
    spyOn(personNoteService, 'list').and.returnValues(of(notes), of([notes[0], notes[1], newNote]));

    tester.componentInstance.person = person;
    const noteEditedObserver = jasmine.createSpy('noteEditedObserver');
    tester.componentInstance.noteEdited.subscribe(noteEditedObserver);
    tester.detectChanges();

    tester.addNote.click();

    expect(noteEditedObserver).toHaveBeenCalledWith(true);

    // enter text of new note
    tester.notes[2].textarea('textarea').fillWith('new text');
    expect(tester.noteComponents[2].noteForm.value.text).toBe('new text');

    // save new note
    tester.saveNote(2).click();

    expect(personNoteService.create).toHaveBeenCalledWith(person.id, 'new text');
    expect(personNoteService.list).toHaveBeenCalledWith(person.id);

    tester.detectChanges();
    expect(tester.notes.length).toBe(3);
    expect(tester.componentInstance.editedNote).toBe(null);
    expect(noteEditedObserver).toHaveBeenCalledWith(false);
  });
});
