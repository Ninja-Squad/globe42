import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CityModel } from './models/person.model';

@Injectable({ providedIn: 'root' })
export class SearchCityService {

  constructor(private http: HttpClient) { }

  /**
   * Returns the first 10 cities matching a request
   */
  search(term: string): Observable<Array<CityModel>> {
    if (term === '') {
      return of([]);
    }

    return this.http.get<Array<CityModel>>('/api/cities', { params : new HttpParams().set('query', term) });
  }

  uploadCities(data: string): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', '/api/cities/uploads', data, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
