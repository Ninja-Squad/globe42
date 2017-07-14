import { JwtInterceptorService } from './jwt-interceptor.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const fakeObservable = {} as Observable<HttpEvent<any>>;

class FakeHttpHandler extends HttpHandler {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return fakeObservable;
  }
}

describe('JwtInterceptorService', () => {
  it('should not add token if no token', () => {
    const interceptor = new JwtInterceptorService();
    const req = new HttpRequest('GET', '/users');

    const handler = new FakeHttpHandler();
    spyOn(handler, 'handle').and.callThrough();

    const result = interceptor.intercept(req, handler);

    expect(handler.handle).toHaveBeenCalledWith(req);
    expect(result).toBe(fakeObservable);
  });

  it('should not add token if token present but request to external resource', () => {
    const interceptor = new JwtInterceptorService();
    interceptor.token = 'secret';
    const req = new HttpRequest('GET', 'http://vicopo.selfbuild.fr/cherche/SAINT');

    const handler = new FakeHttpHandler();
    spyOn(handler, 'handle').and.callThrough();

    const result = interceptor.intercept(req, handler);

    expect(handler.handle).toHaveBeenCalledWith(req);
    expect(result).toBe(fakeObservable);
  });

  it('should add token if token present and request to internal resource', () => {
    const interceptor = new JwtInterceptorService();
    interceptor.token = 'secret';
    const req = new HttpRequest('GET', '/users');

    const handler = new FakeHttpHandler();
    spyOn(handler, 'handle').and.callThrough();

    const result = interceptor.intercept(req, handler);

    expect(handler.handle).toHaveBeenCalled();
    const actualRequest: HttpRequest<any> = (handler.handle as jasmine.Spy).calls.argsFor(0)[0];

    expect(actualRequest.method).toBe('GET');
    expect(actualRequest.url).toBe('/users');
    expect(actualRequest.headers.get('Authorization')).toBe('Bearer secret');

    expect(result).toBe(fakeObservable);
  });
});
