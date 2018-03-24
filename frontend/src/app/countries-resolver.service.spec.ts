import { TestBed } from '@angular/core/testing';

import { CountriesResolverService } from './countries-resolver.service';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CountryService } from './country.service';
import { CountryModel } from './models/country.model';

describe('CountriesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should retrieve the countries', () => {
    const countryService = TestBed.get(CountryService);
    const expectedResults: Observable<Array<CountryModel>> = of([{ id: 'BEL', name: 'Belgique' }]);

    spyOn(countryService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.get(CountriesResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResults);
  });
});
