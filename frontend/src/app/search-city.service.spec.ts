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

  it('should request the city API', () => {
    const city: CityModel = { city: 'SAINT-ETIENNE', code: 42000 };
    const expectedResult = [city];
    let actualResult = [];
    service.search('SAINT').subscribe(result => actualResult = result);
    http.expectOne({ url: '/api/cities?query=SAINT', method: 'GET' }).flush(expectedResult);

    expect(actualResult).toEqual(expectedResult);
  });

});
