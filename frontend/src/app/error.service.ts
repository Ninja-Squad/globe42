import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { FunctionalErrorModel, TechnicalErrorModel } from './models/error.model';
import { tap } from 'rxjs/operators';

/**
 * Service which acts as an HTTP interceptor, in order to emit HTTP errors (which are then consumed by the
 * error component).
 *
 * It separates errors in two kinds: technical and functional errors. Functional errors are expected errors,
 * thrown by the backend using a BadRequestException status code 400) with a JSON body containing a functionalError
 * property. All the other errors are technical.
 *
 * Except for 401 errors returned from the /api/authenticate resource, all the other technical errors are emitted by
 * the interceptor.
 *
 * The functional errors are not emitted by the interceptor. Instead, they're supposed to be handled by the component,
 * the way they want to. If the components just want to display the error in the error component, they can simply pass
 * the function returned by the functionalErrorHandler method in their subscribe/catch operator:
 *
 *   someService.subscribe({
 *     next: ...,
 *     error: this.errorService.functionalErrorHandler()
 *   })
 *
 * This functional error handler will check that the error is indeed functional, and if it is, it will emit it
 * so that the error component can display it in the generic error location.
 */
@Injectable({ providedIn: 'root' })
export class ErrorService implements HttpInterceptor {
  /**
   * Observable that the error component subscribes to in order to receive functional errors emitted by the
   * functionalErrorHandler callback functions returned by this service, and used by the components.
   */
  functionalErrors = new Subject<FunctionalErrorModel>();

  /**
   * Observable that the error component subscribes to in order to receive technical errors emitted by this interceptor
   */
  technicalErrors = new Subject<TechnicalErrorModel>();

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap({ error: error => this.handleError(error) }));
  }

  /**
   * Returns a callback function that can be used by components to react to functional errors and emit them so that
   * the error component displays them in the usual location.
   */
  functionalErrorHandler(): (err: HttpErrorResponse) => void {
    return (err: HttpErrorResponse) => {
      if (this.isFunctional(err)) {
        this.functionalErrors.next(err.error.functionalError);
      }
    };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof Error) {
      // the error is not a HTTP response from the backend
      this.technicalErrors.next({ message: error.error.message });
    } else {
      // the error is a response from the backend
      // if the error is a functional error, ignore it: it should be handled by the component.
      // if the error status is 401, ignore it: the component should handle it
      if (!this.isFunctional(error) && !this.isExpectedAuthenticationError(error)) {
        const body = error.error;

        if (body?.message) {
          // the error is a spring boot error
          this.technicalErrors.next({ status: error.status, message: body.message });
        } else {
          // the error is a an HTTP response, but which doesn't contain a spring boot payload
          this.technicalErrors.next({ status: error.status, message: error.message });
        }
      }
    }
  }

  private isFunctional(error: HttpErrorResponse) {
    const body = error.error;
    return error.status === 400 && body?.functionalError;
  }

  private isExpectedAuthenticationError(error: HttpErrorResponse) {
    return error.status === 401 && error.url.endsWith('/api/authentication');
  }
}
