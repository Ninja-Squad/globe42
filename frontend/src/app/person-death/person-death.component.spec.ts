import { TestBed } from '@angular/core/testing';

import { PersonDeathComponent } from './person-death.component';
import { ComponentTester, stubRoute } from 'ngx-speculoos';
import { FullnamePipe } from '../fullname.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonService } from '../person.service';
import { CurrentPersonService } from '../current-person.service';
import { PersonModel } from '../models/person.model';
import { ValdemortModule } from 'ngx-valdemort';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { CurrentPersonReminderService } from '../current-person-reminder.service';

class PersonDeathComponentTester extends ComponentTester<PersonDeathComponent> {
  constructor() {
    super(PersonDeathComponent);
  }

  get deathDate() {
    return this.input('#deathDate');
  }

  get save() {
    return this.button('#save');
  }
}

describe('PersonDeathComponent', () => {
  let tester: PersonDeathComponentTester;
  let personService: PersonService;
  let currentPersonService: CurrentPersonService;
  let route: ActivatedRoute;
  let router: Router;
  let currentPersonReminderService: jasmine.SpyObj<CurrentPersonReminderService>;

  beforeEach(() => {
    route = stubRoute();
    currentPersonReminderService = jasmine.createSpyObj<CurrentPersonReminderService>(
      'CurrentPersonReminderService',
      ['refresh']
    );

    TestBed.configureTestingModule({
      declarations: [PersonDeathComponent, FullnamePipe],
      imports: [
        HttpClientTestingModule,
        GlobeNgbTestingModule,
        ValdemortModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: CurrentPersonReminderService, useValue: currentPersonReminderService },
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ]
    });

    personService = TestBed.inject(PersonService);
    currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({
      id: 42,
      nickName: 'john'
    } as PersonModel);
    router = TestBed.inject(Router);

    tester = new PersonDeathComponentTester();

    tester.detectChanges();
  });

  it('should display an empy form', () => {
    expect(tester.deathDate).toHaveValue('');
  });

  it('should not save if invalid', () => {
    spyOn(personService, 'signalDeath');
    tester.save.click();
    expect(personService.signalDeath).not.toHaveBeenCalled();
  });

  it('should save if valid', () => {
    spyOn(personService, 'signalDeath').and.returnValue(of(undefined));
    spyOn(currentPersonService, 'refresh').and.returnValue(of({ id: 42 } as PersonModel));
    spyOn(router, 'navigate');

    tester.deathDate.fillWith('25/07/2019');
    tester.save.click();

    expect(personService.signalDeath).toHaveBeenCalledWith(42, { deathDate: '2019-07-25' });
    expect(currentPersonService.refresh).toHaveBeenCalledWith(42);
    expect(currentPersonReminderService.refresh).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['..', 'info'], { relativeTo: route });
  });
});
