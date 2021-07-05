import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { CountryModel } from './models/country.model';

@Injectable({ providedIn: 'root' })
export class CountryService {
  /**
   * The cached countries (no need to load them several times: they never change)
   */
  private countries: Observable<Array<CountryModel>>;

  constructor(private http: HttpClient) {
    this.countries = this.http.get<Array<CountryModel>>('/api/countries').pipe(
      shareReplay(),
      map(array => array.map(country => country))
    );
  }

  list(): Observable<Array<CountryModel>> {
    return this.countries;
  }
}
