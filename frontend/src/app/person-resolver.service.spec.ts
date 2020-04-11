import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PersonResolverService } from './person-resolver.service';
import { PersonModel } from './models/person.model';
import { of } from 'rxjs';
import { CurrentPersonService } from './current-person.service';
import { fakeSnapshot } from 'ngx-speculoos';

describe('PersonResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve a person and refresh the current person', () => {
    const currentPersonService = TestBed.inject(CurrentPersonService);
    const expectedResult = of({ firstName: 'John', lastName: 'Doe' } as PersonModel);

    spyOn(currentPersonService, 'refresh').and.returnValue(expectedResult);

    const resolver = TestBed.inject(PersonResolverService);
    const routeSnapshot = fakeSnapshot({ params: { id: '42' } });
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(currentPersonService.refresh).toHaveBeenCalledWith(42);
  });
});
