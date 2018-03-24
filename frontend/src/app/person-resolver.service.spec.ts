import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PersonResolverService } from './person-resolver.service';
import { PersonService } from './person.service';
import { PersonModel } from './models/person.model';
import { of } from 'rxjs';

describe('PersonResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should retrieve a person', () => {
    const personService = TestBed.get(PersonService);
    const expectedResult = of({ firstName: 'John', lastName: 'Doe' } as PersonModel);

    spyOn(personService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.get(PersonResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(personService.get).toHaveBeenCalledWith(42);
  });
});
