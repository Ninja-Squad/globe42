import { PersonFilesComponent } from './person-files.component';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { FileModel } from '../models/file.model';
import { PersonModel } from '../models/person.model';
import { PersonFileService } from '../person-file.service';
import { ConfirmService } from '../confirm.service';
import { FileSizePipe } from '../file-size.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { By, Title } from '@angular/platform-browser';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrentPersonService } from '../current-person.service';
import { ComponentTester } from 'ngx-speculoos';

class PersonFilesComponentTester extends ComponentTester<PersonFilesComponent> {
  constructor() {
    super(PersonFilesComponent);
  }

  get fileItems() {
    return this.elements('.file-item');
  }

  get fileItemLinks() {
    return this.elements('.file-item a');
  }

  get fileItemDeleteButtons() {
    return this.elements<HTMLButtonElement>('.file-item button');
  }

  get spinner() {
    return this.element('.fa-spinner');
  }

  get progressBar(): NgbProgressbar | null {
    return this.debugElement.query(By.directive(NgbProgressbar))?.componentInstance ?? null;
  }
}

describe('PersonFilesComponent', () => {
  const person = { id: 42, firstName: 'John', lastName: 'Doe' } as PersonModel;
  let files: Array<FileModel>;

  let currentPersonService: CurrentPersonService;
  let tester: PersonFilesComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, GlobeNgbModule.forRoot()],
      declarations: [PersonFilesComponent, FileSizePipe, PageTitleDirective, FullnamePipe]
    });

    currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue(person);

    files = [
      {
        name: 'file1.txt',
        creationInstant: '2017-08-09T12:00:00.000Z',
        size: 1000
      },
      {
        name: 'file2.txt',
        creationInstant: '2017-08-10T12:00:00.000Z',
        size: 1000000
      }
    ] as Array<FileModel>;

    tester = new PersonFilesComponentTester();
  });

  it('should display files', () => {
    const personFileService = TestBed.inject(PersonFileService);
    spyOn(personFileService, 'list').and.returnValue(of(files));

    tester.detectChanges();

    expect(tester.fileItems.length).toBe(2);
    expect(tester.fileItemLinks[0].attr('href')).toContain('/api/persons/42/files/file2.txt');
  });

  it('should display no file message if no files', () => {
    const personFileService = TestBed.inject(PersonFileService);
    spyOn(personFileService, 'list').and.returnValue(of([]));

    tester.detectChanges();

    expect(tester.testElement).toContainText('Aucun document');
  });

  it('should display a spinner after 300 ms until files are available', fakeAsync(() => {
    const personFileService = TestBed.inject(PersonFileService);
    const subject = new Subject<Array<FileModel>>();
    spyOn(personFileService, 'list').and.returnValue(subject);

    tester.detectChanges();
    tick();

    expect(tester.spinner).toBeNull();

    tick(350);
    tester.detectChanges();
    expect(tester.spinner).not.toBeNull();

    subject.next(files);
    tester.detectChanges();
    expect(tester.spinner).toBeNull();
  }));

  it('should delete file', () => {
    // create component with 2 files
    const personFileService = TestBed.inject(PersonFileService);
    const confirmService = TestBed.inject(ConfirmService);
    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(personFileService, 'delete').and.returnValue(of(null));
    spyOn(personFileService, 'list').and.returnValues(of(files), of([files[1]]));

    tester.detectChanges();

    // delete first file and confirm
    tester.fileItemDeleteButtons[0].click();

    expect(personFileService.delete).toHaveBeenCalledWith(person.id, files[1].name);
    expect(personFileService.list).toHaveBeenCalledWith(person.id);

    expect(tester.fileItems.length).toBe(1);
  });

  it('should upload a file', () => {
    // create component with 1 file
    const personFileService = TestBed.inject(PersonFileService);
    spyOn(personFileService, 'list').and.returnValues(of([files[0]]), of(files));

    const fakeEvents = new Subject<any>();
    spyOn(personFileService, 'create').and.returnValues(fakeEvents);

    tester.detectChanges();

    // trigger change
    const fileChangeEvent = {
      target: {
        files: [
          {
            name: files[1].name
          }
        ]
      }
    } as any;

    tester.componentInstance.upload(fileChangeEvent);
    tester.detectChanges();

    expect(tester.componentInstance.uploading).toBeTruthy();

    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 5,
      total: 10
    });
    tester.detectChanges();

    expect(tester.componentInstance.uploadProgress).toBe(5 / 10);
    expect(tester.progressBar.value).toBe(5 / 10);
    expect(tester.progressBar.max).toBe(1);

    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 10,
      total: 10
    });
    tester.detectChanges();

    expect(tester.componentInstance.uploadProgress).toBe(1);
    expect(tester.progressBar.striped).toBeTruthy();
    expect(tester.progressBar.animated).toBeTruthy();

    // emit response and complete
    fakeEvents.next(
      new HttpResponse({
        body: files[1]
      })
    );
    fakeEvents.complete();
    tester.detectChanges();

    expect(tester.fileItems.length).toBe(2);
  });

  it('should set the page title', () => {
    const titleService: Title = TestBed.inject(Title);
    tester.detectChanges();

    expect(titleService.getTitle()).toContain('John Doe: Documents');
  });
});
