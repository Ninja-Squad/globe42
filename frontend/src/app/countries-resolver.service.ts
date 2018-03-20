import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CountryService } from './country.service';
import { Observable } from 'rxjs/Observable';
import { CountryModel } from './models/country.model';

@Injectable()
export class CountriesResolverService implements Resolve<Array<CountryModel>> {

  constructor(private countryService: CountryService) { }

  resolve(): Observable<Array<CountryModel>> {
    return this.countryService.list();
  }
}
