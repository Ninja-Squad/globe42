import { TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { ErrorService } from '../error.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { ComponentTester } from 'ngx-speculoos';

class ErrorComponentTester extends ComponentTester<ErrorComponent> {
  constructor() {
    super(ErrorComponent);
  }

  get alert() {
    return this.element('ngb-alert');
  }

  get alertDetail() {
    return this.alert.element('small');
  }
}

describe('ErrorComponent', () => {
  let errorService: ErrorService;
  let fakeRouter: {
    events: Subject<any>;
  };
  let tester: ErrorComponentTester;

  beforeEach(() => {
    fakeRouter = { events: new Subject<any>() };

    TestBed.configureTestingModule({
      imports: [GlobeNgbTestingModule],
      declarations: [ErrorComponent],
      providers: [{ provide: Router, useValue: fakeRouter }]
    });

    errorService = TestBed.inject(ErrorService);

    tester = new ErrorComponentTester();
  });

  it('should react to technical errors', () => {
    tester.detectChanges();

    expect(tester.componentInstance.error).toBeFalsy();

    errorService.technicalErrors.next({ status: 500, message: 'Server error' });

    expect(tester.componentInstance.error).toEqual({
      status: 500,
      technical: true,
      message: 'Server error'
    });
  });

  it('should react to functional errors without parameters', () => {
    tester.detectChanges();

    expect(tester.componentInstance.error).toBeFalsy();

    errorService.functionalErrors.next({ code: 'USER_LOGIN_ALREADY_EXISTS' });

    expect(tester.componentInstance.error).toEqual({
      technical: false,
      message: 'Un utilisateur ayant le même identifiant existe déjà.'
    });
  });

  it('should react to functional errors with parameters', () => {
    tester.detectChanges();

    expect(tester.componentInstance.error).toBeFalsy();

    errorService.functionalErrors.next({ code: '__TEST__', parameters: { login: 'JB' } });

    expect(tester.componentInstance.error).toEqual({ technical: false, message: 'Hello JB' });
  });

  it('should react to functional errors with unknown code', () => {
    tester.detectChanges();

    expect(tester.componentInstance.error).toBeFalsy();

    errorService.functionalErrors.next({ code: 'UNKNOWN' });

    expect(tester.componentInstance.error).toEqual({ technical: false, message: 'UNKNOWN' });
  });

  it('should react to navigation end events', () => {
    tester.componentInstance.error = { technical: false, message: 'Hello JB' };

    fakeRouter.events.next(new NavigationStart(1, 'url'));
    tester.detectChanges();

    expect(tester.componentInstance.error).not.toBeNull();

    fakeRouter.events.next(new NavigationEnd(1, 'url', ''));
    tester.detectChanges();

    expect(tester.componentInstance.error).toBeNull();
  });

  it('should display a technical error with status', () => {
    tester.detectChanges();

    expect(tester.alert).toBeNull();

    tester.componentInstance.error = { status: 500, technical: true, message: 'Server error' };
    tester.detectChanges();

    expect(tester.alert).toContainText(
      `Une erreur technique inattendue s'est produite. Essayez de recharger la page.`
    );
    expect(tester.alertDetail).toContainText('500 - Server error');

    tester.componentInstance.error = null;
    tester.detectChanges();

    expect(tester.alert).toBeNull();
  });

  it('should display a technical error without status', () => {
    tester.componentInstance.error = { technical: true, message: 'Server error' };
    tester.detectChanges();

    expect(tester.alertDetail).toContainText('Server error');
  });

  it('should display a functional error', () => {
    tester.componentInstance.error = { technical: false, message: 'Booo!' };
    tester.detectChanges();

    expect(tester.alert).toContainText('Booo!');
  });
});
