import { PersonFilesComponent } from './person-files.component';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule, HttpEventType, HttpResponse } from '@angular/common/http';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { FileModel } from '../models/file.model';
import { PersonModel } from '../models/person.model';
import { PersonFileService } from '../person-file.service';
import { ConfirmService } from '../confirm.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FileSizePipe } from '../file-size.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { By } from '@angular/platform-browser';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';

describe('PersonFilesComponent', () => {
  const person = { id: 42 } as PersonModel;
  let files: Array<FileModel>;

  const activatedRoute = {
    parent: {
      snapshot: {
        data: {
          person
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, GlobeNgbModule.forRoot()],
      declarations: [PersonFilesComponent, FileSizePipe],
      providers: [
        PersonFileService,
        ConfirmService,
        { provide: ActivatedRoute, useValue: activatedRoute },
      ]
    });

    files = [
      {
        name: 'file1.txt',
        creationInstant: '2017-08-09T12:00:00.000Z',
        size: 1000,
      },
      {
        name: 'file2.txt',
        creationInstant: '2017-08-10T12:00:00.000Z',
        size: 1000000
      }
    ] as Array<FileModel>;
  }));

  it('should display files', () => {
    const personFileService = TestBed.get(PersonFileService);
    spyOn(personFileService, 'list').and.returnValue(Observable.of(files));

    const fixture = TestBed.createComponent(PersonFilesComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.file-item').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.file-item a').href).toContain('/api/persons/42/files/file2.txt');
  });

  it('should display no file message if no files', () => {
    const personFileService = TestBed.get(PersonFileService);
    spyOn(personFileService, 'list').and.returnValue(Observable.of([]));

    const fixture = TestBed.createComponent(PersonFilesComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucun document');
  });

  it('should display a spinner after 300 ms until files are available', fakeAsync(() => {
    const personFileService = TestBed.get(PersonFileService);
    const subject = new Subject<Array<FileModel>>();
    spyOn(personFileService, 'list').and.returnValue(subject);

    const fixture = TestBed.createComponent(PersonFilesComponent);
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('.fa-spinner')).toBeFalsy();

    tick(350);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-spinner')).toBeTruthy();

    subject.next(files);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-spinner')).toBeFalsy();
  }));

  it('should delete file', () => {
    // create component with 2 files
    const personFileService = TestBed.get(PersonFileService);
    const confirmService = TestBed.get(ConfirmService);
    spyOn(confirmService, 'confirm').and.returnValue(Observable.of('ok'));
    spyOn(personFileService, 'delete').and.returnValue(Observable.of(null));
    spyOn(personFileService, 'list').and.returnValues(Observable.of(files), Observable.of([files[1]]));

    const fixture = TestBed.createComponent(PersonFilesComponent);
    fixture.detectChanges();

    // delete first file and confirm
    fixture.nativeElement.querySelector('.file-item button').click();
    fixture.detectChanges();

    expect(personFileService.delete).toHaveBeenCalledWith(person.id, files[1].name);
    expect(personFileService.list).toHaveBeenCalledWith(person.id);

    expect(fixture.nativeElement.querySelectorAll('.file-item').length).toBe(1);
  });

  it('should upload a file', () => {
    // create component with 1 file
    const personFileService = TestBed.get(PersonFileService);
    spyOn(personFileService, 'list').and.returnValues(Observable.of([files[0]]), Observable.of([files]));

    const fakeEvents = new Subject<any>();
    spyOn(personFileService, 'create').and.returnValues(fakeEvents);

    const fixture = TestBed.createComponent(PersonFilesComponent);
    fixture.detectChanges();

    // trigger change
    const fileChangeEvent = {
      target: {
        files: [{
          name: files[1].name
        }]
      }
    };
    fixture.componentInstance.upload(fileChangeEvent);
    fixture.detectChanges();

    expect(fixture.componentInstance.uploading).toBeTruthy();

    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 5,
      total: 10
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.uploadProgress).toBe(5 / 10);
    const progressBar: NgbProgressbar = fixture.debugElement.query(By.directive(NgbProgressbar)).componentInstance;
    expect(progressBar.value).toBe(5 / 10);
    expect(progressBar.max).toBe(1);

    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 10,
      total: 10
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.uploadProgress).toBe(1);
    expect(progressBar.striped).toBeTruthy();
    expect(progressBar.animated).toBeTruthy();

    // emit response and complete
    fakeEvents.next(new HttpResponse({
      body: files[1]
    }));
    fakeEvents.complete();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('.file-item').length).toBe(2);
    });
  });
});
