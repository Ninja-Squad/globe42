import { TestBed } from '@angular/core/testing';

import { PersonNoteService } from './person-note.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoteCommand, NoteModel } from './models/note.model';
import { HttpTester } from './http-tester.spec';

describe('PersonNoteService', () => {
  let service: PersonNoteService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(PersonNoteService);
    httpTester = new HttpTester(TestBed.inject(HttpTestingController));
  });

  it('should list person notes', () => {
    const expected: Array<NoteModel> = [];
    httpTester.testGet('/api/persons/1/notes', expected, service.list(1));
  });

  it('should create a person note', () => {
    const command: NoteCommand = { text: 'test', category: 'OTHER' };
    const expected = { id: 2, text: 'test' } as NoteModel;
    httpTester.testPost('/api/persons/1/notes', command, expected, service.create(1, command));
  });

  it('should update a person note', () => {
    const command: NoteCommand = { text: 'test2', category: 'APPOINTMENT' };
    httpTester.testPut('/api/persons/1/notes/2', command, service.update(1, 2, command));
  });

  it('should delete a person note', () => {
    httpTester.testDelete('/api/persons/1/notes/2', service.delete(1, 2));
  });
});
