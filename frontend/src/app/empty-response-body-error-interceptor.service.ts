import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

/**
 * Workaround for https://github.com/angular/angular/issues/18680, that should be removed as soon as the issue is fixed.
 */
@Injectable()
export class EmptyResponseBodyErrorInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .catch((err: HttpErrorResponse) => {
        if (err.status >= 200 && err.status < 300) {
          const res = new HttpResponse({
            body: null,
            headers: err.headers,
            status: err.status,
            statusText: err.statusText,
            url: err.url
          });

          return Observable.of(res);
        } else {
          return Observable.throw(err);
        }
      });
  }
}
