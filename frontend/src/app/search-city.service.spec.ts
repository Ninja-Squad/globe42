import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchCityService } from './search-city.service';
import { CityModel } from './models/person.model';
import { HttpTester } from './http-tester.spec';

describe('SearchCityService', () => {

  let service: SearchCityService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(SearchCityService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
  });

  it('should return empty array for empty term', (done: DoneFn) => {
    service.search('').subscribe(res => {
      expect(res).toEqual([]);
      done();
    });
  });

  it('should request the city API', () => {
    const expectedResult = [{ city: 'SAINT-ETIENNE', code: 42000 }] as Array<CityModel>;
    httpTester.testGet('/api/cities?query=SAINT', expectedResult, service.search('SAINT'));
  });

});
