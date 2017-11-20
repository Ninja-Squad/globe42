import { Observable } from 'rxjs/Observable';
import { HttpTestingController } from '@angular/common/http/testing';

export class HttpTester {
  constructor(private http: HttpTestingController) {
  }

  testGet<T>(url: string,
             body: T,
             observable: Observable<T>) {
    let actualBody: T;
    observable.subscribe(result => actualBody = result);

    this.http.expectOne({url, method: 'GET'}).flush(body);

    expect(actualBody).toEqual(body);
  }

  testDelete(url: string, observable: Observable<void>) {
    let ok = false;
    observable.subscribe(() => ok = true);
    this.http.expectOne({url, method: 'DELETE'}).flush(null);
    expect(ok).toBe(true);
  }

  testPost<T>(url: string,
              command: any,
              body: T,
              observable: Observable<T>) {
    let actualBody: T;
    let ok = false;
    observable.subscribe(result => {
      ok = true;
      actualBody = result;
    });

    const testRequest = this.http.expectOne({ url, method: 'POST' });
    expect(testRequest.request.body).toEqual(command);
    testRequest.flush(body);

    expect(ok).toBe(true);
    if (body) {
      expect(actualBody).toEqual(body);
    }
  }

  testPut<T>(url: string,
             command: any,
             observable: Observable<void>) {
    let ok = false;
    observable.subscribe(() => ok = true);

    const testRequest = this.http.expectOne({ url, method: 'PUT' });
    expect(testRequest.request.body).toEqual(command);
    testRequest.flush(204);

    expect(ok).toBe(true);
  }
}
