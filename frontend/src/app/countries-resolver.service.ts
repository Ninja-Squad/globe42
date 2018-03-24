import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CountryService } from './country.service';
import { Observable } from 'rxjs';
import { CountryModel } from './models/country.model';

@Injectable({ providedIn: 'root' })
export class CountriesResolverService implements Resolve<Array<CountryModel>> {

  constructor(private countryService: CountryService) { }

  resolve(): Observable<Array<CountryModel>> {
    return this.countryService.list();
  }
}
