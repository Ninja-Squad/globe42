import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {

  token: string;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('http') && this.token) {
      const clone = req.clone({ setHeaders: { 'Authorization': `Bearer ${this.token}` } });
      return next.handle(clone);
    }
    return next.handle(req);
  }
}
