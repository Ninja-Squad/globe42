import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { CityModel } from './models/user.model';

@Injectable()
export class SearchCityService {

  constructor(private http: Http) { }

  /**
   * Returns the first 10 cities matching a request
   * @param term
   * @returns {any}
   */
  search(term: string): Observable<Array<CityModel>> {
    if (term === '') {
      return Observable.of([]);
    }

    const vicopoUrl = `${window.location.protocol}//vicopo.selfbuild.fr/cherche/${term}`;

    return this.http
      .get(vicopoUrl)
      .map(response => response.json())
      .map(response => response.cities.slice(0, 10) as Array<CityModel>);
  }

}
