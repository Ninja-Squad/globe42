import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PersonsResolverService } from './persons-resolver.service';
import { PersonModel } from './models/person.model';
import { PersonService } from './person.service';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';

describe('PersonsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [PersonsResolverService, PersonService],
    imports: [HttpClientModule]
  }));


  function routeWithType(personListType: string): ActivatedRouteSnapshot {
    const result: any = {
      data: {
        personListType
      },
      queryParamMap: convertToParamMap({})
    };
    return result;
  }

  it('should retrieve the active persons', () => {
    const route = routeWithType('active');
    const personService = TestBed.get(PersonService);
    const expectedResult = Observable.of([{ firstName: 'John', lastName: 'Doe' }] as Array<PersonModel>);

    spyOn(personService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.get(PersonsResolverService);
    const result = resolver.resolve(route);

    expect(result).toBe(expectedResult);
  });

  it('should retrieve the active persons', () => {
    const route = routeWithType('deleted');
    const personService = TestBed.get(PersonService);
    const expectedResult = Observable.of([{ firstName: 'John', lastName: 'Doe' }] as Array<PersonModel>);

    spyOn(personService, 'listDeleted').and.returnValue(expectedResult);

    const resolver = TestBed.get(PersonsResolverService);
    const result = resolver.resolve(route);

    expect(result).toBe(expectedResult);
  });
});
