import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FunctionalErrorModel, TechnicalErrorModel } from './models/error.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ErrorService', () => {

  let service: ErrorService;
  let http: HttpTestingController;
  let httpClient: HttpClient;
  const noop = () => {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: ErrorService,
          multi: true
        }
      ]
    });

    service = TestBed.inject(ErrorService);
    http = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should emit technical error when error is not an HTTP response', () => {
    let error: TechnicalErrorModel;
    service.technicalErrors.subscribe(err => {
      error = err;
    });

    httpClient.get('/test').subscribe({ error: noop });
    http.expectOne('/test').error({ message: 'not good' } as ErrorEvent);

    expect(error.status).toBe(0);
    expect(error.message).toBe('not good');
  });

  it('should emit technical error when error is an HTTP response with no JSON body', () => {
    let error: TechnicalErrorModel;
    service.technicalErrors.subscribe(err => {
      error = err;
    });

    httpClient.get('/test').subscribe({ error: noop });
    http.expectOne('/test').flush(null, {status: 500, statusText: 'Server Error'});

    expect(error.status).toBe(500);
    expect(error.message).toBe('Http failure response for /test: 500 Server Error');
  });

  it('should emit technical error when error is an HTTP response with a spring boot json body', () => {
    let error: TechnicalErrorModel;
    service.technicalErrors.subscribe(err => {
      error = err;
    });

    httpClient.get('/test').subscribe({ error: noop });
    http.expectOne('/test').flush({message: 'Not good'}, {status: 500, statusText: 'Server Error'});

    expect(error.status).toBe(500);
    expect(error.message).toBe('Not good');
  });

  it('should not emit anything when error is an HTTP response with a json body having a functional error', () => {
    let functionalError: FunctionalErrorModel;
    let technicalError: TechnicalErrorModel;

    service.functionalErrors.subscribe(err => {
      functionalError = err;
    });
    service.technicalErrors.subscribe(err => {
      technicalError = err;
    });

    httpClient.get('/test').subscribe({ error: noop });

    const functionalErrorBody = {
      message: 'Not good',
      functionalError: {
        code: 'ERROR_CODE',
        parameters: {foo: 'bar'}
      }
    };
    http.expectOne('/test').flush(functionalErrorBody, {status: 400, statusText: 'Bad Request'});

    expect(functionalError).toBeUndefined();
    expect(technicalError).toBeUndefined();
  });

  it('should not emit anything when error is an HTTP response with a 401 status for the authentication resource', () => {
    let functionalError: FunctionalErrorModel;
    let technicalError: TechnicalErrorModel;

    service.functionalErrors.subscribe(err => {
      functionalError = err;
    });
    service.technicalErrors.subscribe(err => {
      technicalError = err;
    });

    httpClient.get('/api/authentication').subscribe({ error: noop });
    http.expectOne('/api/authentication').flush(null, {status: 401, statusText: 'Unauthorized'});

    expect(functionalError).toBeUndefined();
    expect(technicalError).toBeUndefined();
  });

  it('should emit a functional error when the handler is invoked with a functional error response', () => {
    let error: FunctionalErrorModel;

    service.functionalErrors.subscribe(err => {
      error = err;
    });

    service.functionalErrorHandler()(new HttpErrorResponse({
      status: 400,
      statusText: 'Server Error',
      error: {
        message: 'Not good',
        functionalError: {
          code: 'ERROR_CODE',
          parameters: {foo: 'bar'}
        }
      }
    }));

    expect(error.code).toBe('ERROR_CODE');
    expect(error.parameters).toEqual({foo: 'bar'});
  });
});
