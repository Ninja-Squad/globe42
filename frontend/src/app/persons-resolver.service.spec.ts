import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PersonsResolverService } from './persons-resolver.service';
import { PersonModel } from './models/person.model';
import { PersonService } from './person.service';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('PersonsResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

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
    const personService = TestBed.inject(PersonService);
    const expectedResult = of([{ firstName: 'John', lastName: 'Doe' }] as Array<PersonModel>);

    spyOn(personService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.inject(PersonsResolverService);
    const result = resolver.resolve(route);

    expect(result).toBe(expectedResult);
  });

  it('should retrieve the active persons', () => {
    const route = routeWithType('deleted');
    const personService = TestBed.inject(PersonService);
    const expectedResult = of([{ firstName: 'John', lastName: 'Doe' }] as Array<PersonModel>);

    spyOn(personService, 'listDeleted').and.returnValue(expectedResult);

    const resolver = TestBed.inject(PersonsResolverService);
    const result = resolver.resolve(route);

    expect(result).toBe(expectedResult);
  });
});
