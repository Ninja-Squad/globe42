import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { FunctionalErrorModel, TechnicalErrorModel } from './models/error.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// should rather use the HttpClientTestingModule, which would allow to make _handleError private,
// but the issue https://github.com/angular/angular/issues/18181 prevents doing that
describe('ErrorInterceptorService', () => {

  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ErrorService ]
    });

    service = TestBed.get(ErrorService);
  });

  it('should emit technical error when error is not an HTTP response', () => {
    let error: TechnicalErrorModel;
    service.technicalErrors.subscribe(err => {
      error = err;
    });

    service._handleError(new HttpErrorResponse({ error: new Error('not good') }));

    expect(error.status).toBeUndefined();
    expect(error.message).toBe('not good');
  });

  it('should emit technical error when error is an HTTP response with no JSON body', () => {
    let error: TechnicalErrorModel;
    service.technicalErrors.subscribe(err => {
      error = err;
    });

    service._handleError(new HttpErrorResponse({ status: 500, statusText: 'Server Error' }));

    expect(error.status).toBe(500);
    expect(error.message).toBe('Http failure response for (unknown url): 500 Server Error');
  });

  it('should emit technical error when error is an HTTP response with a spring boot json body', () => {
    let error: TechnicalErrorModel;
    service.technicalErrors.subscribe(err => {
      error = err;
    });

    service._handleError(new HttpErrorResponse({ status: 500, statusText: 'Server Error', error: { message: 'Not good' } }));

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

    service._handleError(new HttpErrorResponse({
      status: 400,
      statusText: 'Server Error',
      error: {
        message: 'Not good',
        functionalError: {
          code: 'ERROR_CODE',
          parameters: { foo: 'bar' }
        }
      }
    }));

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

    service._handleError(new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: 'http://localhost/api/authentication'
    }));

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
          parameters: { foo: 'bar' }
        }
      }
    }));

    expect(error.code).toBe('ERROR_CODE');
    expect(error.parameters).toEqual({ foo: 'bar' });
  });

  it('should intercept', () => {
    // we expect this will be populated when the observable returned by the next handler throws an HttpErrorResponse
    let error: TechnicalErrorModel;
    service.technicalErrors.subscribe(err => {
      error = err;
    });

    // create a fake next handle that throws an HttpErrorResponse when we want to
    const errorSubject = new Subject<HttpEvent<any>>();
    const next: HttpHandler = {
      handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return errorSubject;
      }
    };

    // call intercept() on our service
    service.intercept(null, next).subscribe(null, () => {});

    // make the next handler throw
    errorSubject.error(new HttpErrorResponse({ error: new Error('not good') }));

    // check that the service indeed emitted a technical error
    expect(error.status).toBeUndefined();
    expect(error.message).toBe('not good');
  });
});
