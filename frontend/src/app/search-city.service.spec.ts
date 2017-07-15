import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchCityService } from './search-city.service';
import { CityModel } from './models/person.model';

describe('SearchCityService', () => {

  let service: SearchCityService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ SearchCityService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(SearchCityService);
    http = TestBed.get(HttpTestingController);
  });

  it('should return empty array for empty term', async(() => {
    service.search('').subscribe(res => expect(res).toEqual([]));
  }));

  it('should request the vicopo API', () => {
    const city: CityModel = { city: 'SAINT-ETIENNE', code: 42000 };
    const body = { cities: [city] };

    const expectedResult = [city];
    let actualResult = [];
    service.search('SAINT').subscribe(result => actualResult = result);
    http.expectOne({ url: 'http://vicopo.selfbuild.fr/cherche/SAINT', method: 'GET' }).flush(body);

    expect(actualResult).toEqual(expectedResult);
  });

});
