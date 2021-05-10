import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CitiesUploadComponent } from './cities-upload.component';
import { SearchCityService } from '../search-city.service';
import { Subject } from 'rxjs';
import { HttpClientModule, HttpEventType, HttpResponse } from '@angular/common/http';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

function tickSeconds(seconds: number) {
  tick(seconds * 1000);
}

class CitiesUploadComponentTester extends ComponentTester<CitiesUploadComponent> {
  constructor() {
    super(CitiesUploadComponent);
  }

  get infoMessage() {
    return this.element('#info-message');
  }

  get progress() {
    return this.element('#progress');
  }

  get fileInput() {
    return this.element('#file-input');
  }
}

describe('CitiesUploadComponent', () => {
  let tester: CitiesUploadComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobeNgbTestingModule, HttpClientModule],
      declarations: [CitiesUploadComponent, PageTitleDirective]
    });

    tester = new CitiesUploadComponentTester();
  });

  it('should upload', fakeAsync(() => {
    const cityService = TestBed.inject(SearchCityService);
    const component = tester.componentInstance;

    expect(component.status).toBe('pending');

    const fakeFile = 'fakeFile' as unknown as Blob;
    const fileChangeEvent = {
      target: {
        files: ['fakeFile']
      }
    } as any;

    const fileReader = new FileReader();
    spyOn(fileReader, 'readAsText');

    spyOn(component, '_createFileReader').and.returnValue(fileReader);

    component.upload(fileChangeEvent);
    expect(fileReader.onload).toBeDefined();
    expect(fileReader.readAsText).toHaveBeenCalledWith(fakeFile, 'UTF8');

    const fileLoadedEvent: any = {
      target: {
        result: 'fakeFileContent'
      }
    };

    const fakeEvents = new Subject<any>();
    spyOn(cityService, 'uploadCities').and.returnValue(fakeEvents);

    fileReader.onload(fileLoadedEvent);
    expect(component.status).toBe('uploading');

    tickSeconds(5);
    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 5,
      total: 10
    });

    // upload is halfway and has taken 5 seconds. Estimated processing time is 20 seconds
    // so total time is 30 seconds and we're thus at 5 / 30
    expect(component.progress).toBe(5 / 30);

    tickSeconds(5);
    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 10,
      total: 10
    });

    expect(component.progress).toBe(10 / 30);
    expect(component.status).toBe('processing');

    tickSeconds(10);
    expect(component.progress).toBe(20 / 30);

    tickSeconds(5);
    expect(component.progress).toBe(25 / 30);

    tickSeconds(6);
    expect(component.progress).toBeLessThan(1);
    expect(component.status).toBe('processing');

    // emit response and complete
    fakeEvents.next(new HttpResponse());
    fakeEvents.complete();
    expect(component.progress).toBe(1);
    expect(component.status).toBe('done');
  }));

  it('should finish if response comes back early', fakeAsync(() => {
    const cityService = TestBed.inject(SearchCityService);
    const component = tester.componentInstance;

    expect(component.status).toBe('pending');

    const fakeFile = 'fakeFile' as unknown as Blob;
    const fileChangeEvent = {
      target: {
        files: [fakeFile]
      }
    } as any;

    const fileReader = new FileReader();
    spyOn(fileReader, 'readAsText');
    spyOn(component, '_createFileReader').and.returnValue(fileReader);

    component.upload(fileChangeEvent);
    expect(fileReader.onload).toBeDefined();
    expect(fileReader.readAsText).toHaveBeenCalledWith(fakeFile, 'UTF8');

    const fileLoadedEvent: any = {
      target: {
        result: 'fakeFileContent'
      }
    };

    const fakeEvents = new Subject<any>();
    spyOn(cityService, 'uploadCities').and.returnValue(fakeEvents);

    fileReader.onload(fileLoadedEvent);
    expect(component.status).toBe('uploading');

    // emit last progress events
    tickSeconds(10);
    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 10,
      total: 10
    });

    expect(component.progress).toBe(10 / 30);
    expect(component.status).toBe('processing');

    tickSeconds(15);
    expect(component.progress).toBe(25 / 30);

    // emit response and complete
    fakeEvents.next(new HttpResponse());
    fakeEvents.complete();
    expect(component.progress).toBe(1);
    expect(component.status).toBe('done');

    // let the fake event observable a chance to realize that the processing is done
    tickSeconds(1);
  }));

  it('should display an info message and a file upload control, and no progress', () => {
    tester.detectChanges();

    expect(tester.infoMessage).not.toBeNull();
    expect(tester.fileInput).not.toBeNull();
    expect(tester.progress).toBeNull();
  });

  it('should hide the file upload control, and display the progress', () => {
    tester.componentInstance.status = 'uploading';
    tester.componentInstance.progress = 0.5;

    tester.detectChanges();

    expect(tester.fileInput).toBeNull();
    expect(tester.progress).toContainText('Téléchargement en cours');
    expect(tester.progress).toContainText('50%');

    tester.componentInstance.status = 'processing';
    tester.componentInstance.progress = 0.9;
    tester.detectChanges();

    expect(tester.progress).toContainText('Traitement en cours');
    expect(tester.progress).toContainText('90%');

    tester.componentInstance.status = 'done';
    tester.componentInstance.progress = 1;
    tester.detectChanges();

    expect(tester.progress).toContainText('Terminé');
    expect(tester.progress).toContainText('100%');
  });
});
