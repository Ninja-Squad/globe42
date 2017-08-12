import { TestBed, inject } from '@angular/core/testing';

import { PersonNoteService } from './person-note.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoteModel } from './models/note.model';

describe('PersonNoteService', () => {
  let service: PersonNoteService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PersonNoteService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(PersonNoteService);
    http = TestBed.get(HttpTestingController);
  });

  it('should list person notes', () => {
    const expected: Array<NoteModel> = [];

    let actual: Array<NoteModel>;
    service.list(1).subscribe(notes => actual = notes);

    http.expectOne({url: '/api/persons/1/notes', method: 'GET'}).flush(expected);
    expect(actual).toEqual(expected);
  });

  it('should create a person note', () => {
    const command = { text: 'test' };
    const expected = { id: 2, text: 'test' } as NoteModel;

    let actual;
    service.create(1, 'test').subscribe(note => actual = note);

    const testRequest = http.expectOne({ url: '/api/persons/1/notes', method: 'POST' });
    expect(testRequest.request.body).toEqual(command);
    testRequest.flush(expected);

    expect(actual).toEqual(expected);
  });

  it('should update a person note', () => {
    const command = { text: 'test2' };
    const expected = { id: 2, text: 'test2' } as NoteModel;

    let ok = false;
    service.update(1, 2, 'test2').subscribe(() => ok = true);

    const testRequest = http.expectOne({ url: '/api/persons/1/notes/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(command);
    testRequest.flush(expected);

    expect(ok).toBe(true);
  });

  it('should delete a person note', () => {
    let ok = false;
    service.delete(1, 2).subscribe(() => ok = true);
    http.expectOne({ url: '/api/persons/1/notes/2', method: 'DELETE' }).flush(null);
    expect(ok).toBe(true);
  });
});
