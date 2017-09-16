import { PersonFileService } from './person-file.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FileModel } from './models/file.model';
import { HttpEvent, HttpResponse } from '@angular/common/http';

describe('PersonFileService', () => {
  let service: PersonFileService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PersonFileService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(PersonFileService);
    http = TestBed.get(HttpTestingController);
  });

  it('should list person files', () => {
    const expected: Array<FileModel> = [];

    let actual: Array<FileModel>;
    service.list(1).subscribe(files => actual = files);

    http.expectOne({url: '/api/persons/1/files', method: 'GET'}).flush(expected);
    expect(actual).toEqual(expected);
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
    expect(body.has('file')).toBeTruthy();

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
    let ok = false;
    service.delete(1, 'test 1.txt').subscribe(() => ok = true);
    http.expectOne({ url: '/api/persons/1/files/test%201.txt', method: 'DELETE' }).flush(null);
    expect(ok).toBe(true);
  });
});
