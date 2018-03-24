import { TestBed } from '@angular/core/testing';

import { PersonNoteService } from './person-note.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoteModel } from './models/note.model';
import { HttpTester } from './http-tester.spec';

describe('PersonNoteService', () => {
  let service: PersonNoteService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(PersonNoteService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
  });

  it('should list person notes', () => {
    const expected: Array<NoteModel> = [];
    httpTester.testGet('/api/persons/1/notes', expected, service.list(1));
  });

  it('should create a person note', () => {
    const command = { text: 'test' };
    const expected = { id: 2, text: 'test' } as NoteModel;
    httpTester.testPost('/api/persons/1/notes', command, expected, service.create(1, 'test'));
  });

  it('should update a person note', () => {
    const command = { text: 'test2' };
    httpTester.testPut('/api/persons/1/notes/2', command, service.update(1, 2, 'test2'));
  });

  it('should delete a person note', () => {
    httpTester.testDelete('/api/persons/1/notes/2', service.delete(1, 2));
  });
});
