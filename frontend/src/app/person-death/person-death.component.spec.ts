import { async, TestBed } from '@angular/core/testing';

import { PersonDeathComponent } from './person-death.component';
import { ComponentTester, fakeRoute, speculoosMatchers } from 'ngx-speculoos';
import { FullnamePipe } from '../fullname.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonService } from '../person.service';
import { CurrentPersonService } from '../current-person.service';
import { PersonModel } from '../models/person.model';
import { ValdemortModule } from 'ngx-valdemort';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';

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

  beforeEach(async(() => {
    route = fakeRoute({});

    TestBed.configureTestingModule({
      declarations: [ PersonDeathComponent, FullnamePipe ],
      imports: [
        HttpClientTestingModule,
        GlobeNgbModule.forRoot(),
        ValdemortModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: LOCALE_ID, useValue: 'fr-FR' },
      ]
    });

    personService = TestBed.get(PersonService);
    currentPersonService = TestBed.get(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({
      id: 42,
      nickName: 'john'
    } as PersonModel);
    router = TestBed.get(Router);

    tester = new PersonDeathComponentTester();

    jasmine.addMatchers(speculoosMatchers);

    tester.detectChanges();
  }));

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
    spyOn(currentPersonService, 'refresh').and.returnValue(of({id: 42} as PersonModel));
    spyOn(router, 'navigate');

    tester.deathDate.fillWith('25/07/2019');
    tester.save.click();

    expect(personService.signalDeath).toHaveBeenCalledWith(42, { deathDate: '2019-07-25' });
    expect(currentPersonService.refresh).toHaveBeenCalledWith(42);
    expect(router.navigate).toHaveBeenCalledWith(['..', 'info'], { relativeTo: route });
  });
});