import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CitiesUploadComponent } from './cities-upload.component';
import { SearchCityService } from '../search-city.service';
import { Subject } from 'rxjs/Subject';
import { HttpClientModule, HttpEventType, HttpResponse } from '@angular/common/http';
import { NowService } from '../now.service';
import { DateTime } from 'luxon';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';

describe('CitiesUploadComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GlobeNgbModule.forRoot(), HttpClientModule],
      declarations: [CitiesUploadComponent],
      providers: [NowService, SearchCityService]
    });
  }));

  it('should upload', fakeAsync(() => {
    const cityService = TestBed.get(SearchCityService);
    const nowService = TestBed.get(NowService);
    const component = new CitiesUploadComponent(cityService, nowService);

    expect(component.status).toBe('pending');

    const fileChangeEvent = {
      target: {
        files: ['fakeFile']
      }
    };

    const fileReader = new FileReader();
    spyOn(fileReader, 'readAsText');

    spyOn(component, '_createFileReader').and.returnValue(fileReader);

    let fakeNow = DateTime.local();
    spyOn(nowService, 'now').and.callFake(() => fakeNow);

    component.upload(fileChangeEvent);
    expect(fileReader.onload).toBeDefined();
    expect(fileReader.readAsText).toHaveBeenCalledWith('fakeFile', 'UTF8');

    const fileLoadedEvent: any = {
      target: {
        result: 'fakeFileContent'
      }
    };

    const fakeEvents = new Subject<any>();
    spyOn(cityService, 'uploadCities').and.returnValue(fakeEvents);

    fileReader.onload(fileLoadedEvent);
    expect(component.status).toBe('uploading');

    // emit first progress event after 5 seconds
    fakeNow = fakeNow.plus({ seconds: 5 });
    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 5,
      total: 10
    });

    // upload is halfway and has taken 5 seconds. Estimated processing time is 20 seconds
    // so total time is 30 seconds and we're thus at 5 / 30
    expect(component.progress).toBe(5 / 30);

    // emit last progress events
    fakeNow = fakeNow.plus({ seconds: 5 });
    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 10,
      total: 10
    });

    expect(component.progress).toBe(10 / 30);
    expect(component.status).toBe('processing');

    fakeNow = fakeNow.plus({ seconds: 10 });
    tick(10000);
    expect(component.progress).toBe(20 / 30);

    fakeNow = fakeNow.plus({ seconds: 5 });
    tick(5000);
    expect(component.progress).toBe(25 / 30);

    fakeNow = fakeNow.plus({ seconds: 6 });
    tick(6000);
    expect(component.progress).toBeLessThan(1);
    expect(component.status).toBe('processing');

    // emit response and complete
    fakeEvents.next(new HttpResponse());
    fakeEvents.complete();
    expect(component.progress).toBe(1);
    expect(component.status).toBe('done');
  }));

  it('should finish if response comes back early', fakeAsync(() => {
    const cityService = TestBed.get(SearchCityService);
    const nowService = TestBed.get(NowService);
    const component = new CitiesUploadComponent(cityService, nowService);

    expect(component.status).toBe('pending');

    const fileChangeEvent = {
      target: {
        files: ['fakeFile']
      }
    };

    const fileReader = new FileReader();
    spyOn(fileReader, 'readAsText');
    spyOn(component, '_createFileReader').and.returnValue(fileReader);
    let fakeNow = DateTime.local();
    spyOn(nowService, 'now').and.callFake(() => fakeNow);

    component.upload(fileChangeEvent);
    expect(fileReader.onload).toBeDefined();
    expect(fileReader.readAsText).toHaveBeenCalledWith('fakeFile', 'UTF8');

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
    fakeNow = fakeNow.plus({ seconds: 10 });
    fakeEvents.next({
      type: HttpEventType.UploadProgress,
      loaded: 10,
      total: 10
    });

    expect(component.progress).toBe(10 / 30);
    expect(component.status).toBe('processing');

    fakeNow = fakeNow.plus({ seconds: 15 });
    tick(15000);
    expect(component.progress).toBe(25 / 30);

    // emit response and complete
    fakeEvents.next(new HttpResponse());
    fakeEvents.complete();
    expect(component.progress).toBe(1);
    expect(component.status).toBe('done');

    // let the fake event observable a chance to realize that the processing is done
    fakeNow = fakeNow.plus({ seconds: 1 });
    tick(1000);
  }));

  it('should display an info message and a file upload control, and no progress', () => {
    const fixture = TestBed.createComponent(CitiesUploadComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#info-message')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#file-input')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#progress')).toBeFalsy();
  });

  it('should hide the file upload control, and display the progress', () => {
    const fixture = TestBed.createComponent(CitiesUploadComponent);
    const component = fixture.componentInstance;

    component.status = 'uploading';
    component.progress = 0.5;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#file-input')).toBeFalsy();
    const progres = fixture.nativeElement.querySelector('#progress');
    expect(progres.textContent).toContain('Téléchargement en cours');
    expect(progres.textContent).toContain('50%');

    component.status = 'processing';
    component.progress = 0.9;

    fixture.detectChanges();
    expect(progres.textContent).toContain('Traitement en cours');
    expect(progres.textContent).toContain('90%');

    component.status = 'done';
    component.progress = 1;

    fixture.detectChanges();
    expect(progres.textContent).toContain('Terminé');
    expect(progres.textContent).toContain('100%');
  });
});
