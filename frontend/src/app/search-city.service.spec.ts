import { async, TestBed } from '@angular/core/testing';

import { SearchCityService } from './search-city.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { CityModel } from './models/person.model';

describe('SearchCityService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SearchCityService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      }
    ]
  }));

  it('should return empty array for empty term', async(() => {
    const service = TestBed.get(SearchCityService);

    service.search('').subscribe(res => expect(res).toEqual([]));
  }));

  it('should request the vicopo API', async(() => {
    const service = TestBed.get(SearchCityService);
    const mockBackend = TestBed.get(MockBackend);
    const city: CityModel = { city: 'SAINT-ETIENNE', code: 42000 };
    const body = { cities: [city] };
    const response = new Response(new ResponseOptions({ body }));
    mockBackend.connections.subscribe(connection => {
      const request = connection.request;
      expect(request.url).toBe('http://vicopo.selfbuild.fr/cherche/SAINT');
      expect(request.method).toBe(RequestMethod.Get);
      connection.mockRespond(response)
    });

    service.search('SAINT').subscribe(res => {
      expect(res).toEqual([city])
    });
  }));

});
