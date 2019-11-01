import { TestBed } from '@angular/core/testing';

import { CurrentPersonService } from './current-person.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { of } from 'rxjs';
import { PersonModel } from './models/person.model';

describe('CurrentPersonService', () => {

  let service: CurrentPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(CurrentPersonService);
  });

  it('should have null initially', () => {
    expect(service.snapshot).toBeNull();
    let actualPerson: PersonModel;
    service.personChanges$.subscribe(p => actualPerson = p);
    expect(actualPerson).toBeNull();
  });

  it('should refresh', () => {
    const personService: PersonService = TestBed.inject(PersonService);
    const expectedPerson = { id: 42} as PersonModel;
    spyOn(personService, 'get').and.returnValue(of(expectedPerson));

    let actualPerson: PersonModel;
    service.personChanges$.subscribe(p => actualPerson = p);
    service.refresh(42).subscribe(p => actualPerson = p);
    expect(actualPerson).toBe(expectedPerson);

    actualPerson = undefined;
    expect(service.snapshot).toBe(expectedPerson);
    service.personChanges$.subscribe(p => actualPerson = p);
    expect(actualPerson).toBe(expectedPerson);
  });
});
