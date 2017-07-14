import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PersonsResolverService } from './persons-resolver.service';
import { PersonModel } from './models/person.model';
import { PersonService } from './person.service';

describe('PersonsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [PersonsResolverService, PersonService],
    imports: [HttpClientModule]
  }));

  it('should retrieve the persons', () => {
    const personService = TestBed.get(PersonService);
    const expectedResult: Observable<Array<PersonModel>> = Observable.of([{ firstName: 'John', lastName: 'Doe' }]);

    spyOn(personService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.get(PersonsResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResult);
  });
});
