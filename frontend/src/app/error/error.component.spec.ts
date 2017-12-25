import { async, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { ErrorService } from '../error.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';

describe('ErrorComponent', () => {

  let errorService: ErrorService;
  let fakeRouter: {
    events: Subject<any>
  };

  beforeEach(async(() => {
    fakeRouter = {events: new Subject<any>()};

    TestBed.configureTestingModule({
      imports: [GlobeNgbModule.forRoot()],
      declarations: [ErrorComponent],
      providers: [
        {provide: Router, useValue: fakeRouter},
        ErrorService
      ]
    });


    errorService = TestBed.get(ErrorService);
  }));

  it('should react to technical errors', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.error).toBeFalsy();

    errorService.technicalErrors.next({status: 500, message: 'Server error'});

    expect(component.error).toEqual({status: 500, technical: true, message: 'Server error'});
  });

  it('should react to functional errors without parameters', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.error).toBeFalsy();

    errorService.functionalErrors.next({code: 'USER_LOGIN_ALREADY_EXISTS'});

    expect(component.error).toEqual({
      technical: false,
      message: 'Un utilisateur ayant le même identifiant existe déjà.'
    });
  });

  it('should react to functional errors with parameters', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.error).toBeFalsy();

    errorService.functionalErrors.next({code: '__TEST__', parameters: {login: 'JB'}});

    expect(component.error).toEqual({technical: false, message: 'Hello JB'});
  });

  it('should react to functional errors with unknown code', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.error).toBeFalsy();

    errorService.functionalErrors.next({code: 'UNKNOWN'});

    expect(component.error).toEqual({technical: false, message: 'UNKNOWN'});
  });

  it('should react to navigation end events', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;

    component.error = {technical: false, message: 'Hello JB'};

    fakeRouter.events.next(new NavigationStart(1, 'url'));
    fixture.detectChanges();

    expect(component.error).not.toBeNull();

    fakeRouter.events.next(new NavigationEnd(1, 'url', ''));
    fixture.detectChanges();

    expect(component.error).toBeNull();
  });

  it('should display a technical error with status', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;
    const element = fixture.nativeElement;

    fixture.detectChanges();

    expect(element.querySelector('ngb-alert')).toBeNull();

    component.error = {status: 500, technical: true, message: 'Server error'};
    fixture.detectChanges();

    expect(element.querySelector('ngb-alert').textContent).toContain(
      'Une erreur technique inattendue s\'est produite. Essayez de recharger la page.');
    expect(element.querySelector('ngb-alert small').textContent).toContain('500 - Server error');

    component.error = null;
    fixture.detectChanges();

    expect(element.querySelector('ngb-alert')).toBeNull();
  });

  it('should display a technical error without status', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;
    const element = fixture.nativeElement;

    component.error = {technical: true, message: 'Server error'};
    fixture.detectChanges();

    expect(element.querySelector('ngb-alert small').textContent).toContain('Server error');
  });

  it('should display a functional error', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;
    const element = fixture.nativeElement;

    component.error = {technical: false, message: 'Booo!'};
    fixture.detectChanges();

    expect(element.querySelector('ngb-alert').textContent).toContain('Booo!');
  });
});
