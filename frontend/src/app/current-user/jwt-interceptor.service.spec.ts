import { JwtInterceptorService } from './jwt-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('JwtInterceptorService', () => {

  let http: HttpTestingController;
  let httpClient: HttpClient;
  let service: JwtInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: JwtInterceptorService,
          multi: true
        }
      ],
      imports: [ HttpClientTestingModule ]
    });

    http = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
    service = TestBed.get(JwtInterceptorService);
  });

  it('should not add token if no token', () => {
    httpClient.get('/test').subscribe();
    const testRequest = http.expectOne('/test');
    testRequest.flush(null);

    expect(testRequest.request.headers.get('Authorization')).toBeNull();
  });

  it('should not add token if token present but request to external resource', () => {
    service.token = 'secret';
    const url = 'http://vicopo.selfbuild.fr/cherche/SAINT';
    httpClient.get(url).subscribe();
    const testRequest = http.expectOne(url);
    testRequest.flush(null);

    expect(testRequest.request.headers.get('Authorization')).toBeNull();
  });

  it('should add token if token present and request to internal resource', () => {
    service.token = 'secret';
    httpClient.get('/test').subscribe();
    const testRequest = http.expectOne('/test');
    testRequest.flush(null);

    expect(testRequest.request.headers.get('Authorization')).toBe('Bearer secret');
  });
});
