import { TestBed } from '@angular/core/testing';

import { PersonsWithRemindersResolverService } from './persons-with-reminders-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { PersonService } from './person.service';
import { of } from 'rxjs';
import { PersonWithRemindersModel } from './models/person.model';

describe('PersonsWithRemindersResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve the active persons', () => {
    const personService = TestBed.inject(PersonService);
    const expectedResult = of([{ id: 42 }] as Array<PersonWithRemindersModel>);

    spyOn(personService, 'listWithReminders').and.returnValue(expectedResult);

    const resolver = TestBed.inject(PersonsWithRemindersResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResult);
  });
});
