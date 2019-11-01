import { PersonFileService } from './person-file.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FileModel } from './models/file.model';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { HttpTester } from './http-tester.spec';

describe('PersonFileService', () => {
  let service: PersonFileService;
  let http: HttpTestingController;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.inject(PersonFileService);
    http = TestBed.inject(HttpTestingController);
    httpTester = new HttpTester(http);
  });

  it('should list person files', () => {
    const expected: Array<FileModel> = [];
    httpTester.testGet('/api/persons/1/files', expected, service.list(1));
  });

  it('should give the url of a file', () => {
    expect(service.url(1, 'test.txt')).toBe('/api/persons/1/files/test.txt');
    expect(service.url(1, 'test 1.txt')).toBe('/api/persons/1/files/test%201.txt');
  });

  it('should create a file', () => {
    const file: File = {
      name: 'test 1.txt',
      type: 'text/plain',
      size: 1234
    } as File;

    let actual: HttpEvent<any> = null;
    service.create(1, file).subscribe(event => actual = event);

    const testRequest = http.expectOne({ url: '/api/persons/1/files', method: 'POST' });
    const body: FormData = testRequest.request.body;

    // Safari sucks: it doesn't support inspecting the form data
    if (!window.navigator.userAgent.includes('Safari/')) {
      expect(body.has('file')).toBeTruthy();
    }

    const expected: FileModel = {
      name: 'test 1.txt',
      size: 1234,
      contentType: 'text/plain',
      creationInstant: '2017-09-18T08:50:00.000Z'
    };
    testRequest.flush(expected);

    expect((actual as HttpResponse<FileModel>).body).toEqual(expected);
  });

  it('should delete a file', () => {
    httpTester.testDelete('/api/persons/1/files/test%201.txt', service.delete(1, 'test 1.txt'));
  });
});
