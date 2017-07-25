import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { CityModel } from './models/person.model';

@Injectable()
export class SearchCityService {

  constructor(private http: HttpClient) { }

  /**
   * Returns the first 10 cities matching a request
   */
  search(term: string): Observable<Array<CityModel>> {
    if (term === '') {
      return Observable.of([]);
    }

    return this.http.get('/api/cities', { params : new HttpParams().set('query', term) });
  }

  uploadCities(data: string): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', '/api/cities/uploads', data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
