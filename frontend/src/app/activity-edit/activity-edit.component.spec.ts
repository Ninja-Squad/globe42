import { TestBed } from '@angular/core/testing';

import { ActivityEditComponent } from './activity-edit.component';
import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { ActivityService } from '../activity.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FullnamePipe } from '../fullname.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { PersonService } from '../person.service';
import { PersonIdentityModel } from '../models/person.model';
import { of } from 'rxjs';
import { ParticipationService } from '../participation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ValdemortModule } from 'ngx-valdemort';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { Activity } from '../models/activity.model';
import { ActivityType, activityType } from '../models/activity-type.model';
import { PageTitleDirective } from '../page-title.directive';

class ActivityEditComponentTester extends ComponentTester<ActivityEditComponent> {
  constructor() {
    super(ActivityEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get type() {
    return this.select('#type');
  }

  get date() {
    return this.input('#date');
  }

  get absentItems() {
    return this.elements('.absent-item');
  }

  get presentItems() {
    return this.elements('.present-item');
  }

  get addPresentButtons() {
    return this.elements<HTMLButtonElement>('.add-present-button');
  }

  get removePresentButtons() {
    return this.elements<HTMLButtonElement>('.remove-present-button');
  }

  get showAllPersons() {
    return this.input('#show-all-persons');
  }

  get startWithFirstName() {
    return this.input('#start-with-first-name');
  }

  get saveButton() {
    return this.button('#save-button');
  }

  get errors() {
    return this.elements('val-errors div');
  }
}

describe('ActivityEditComponent', () => {
  let tester: ActivityEditComponentTester;
  let participationService: jasmine.SpyObj<ParticipationService>;
  let activityService: jasmine.SpyObj<ActivityService>;
  let personService: jasmine.SpyObj<PersonService>;

  function configureTestingModule(route: ActivatedRoute) {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, ValdemortModule, GlobeNgbTestingModule],
      declarations: [
        ActivityEditComponent,
        FullnamePipe,
        PageTitleDirective,
        ValidationDefaultsComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: ActivityService, useValue: activityService },
        { provide: ParticipationService, useValue: participationService },
        { provide: PersonService, useValue: personService },
        { provide: LOCALE_ID, useValue: 'fr' }
      ]
    });

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
  }

  let joe: PersonIdentityModel;
  let jack: PersonIdentityModel;
  let william: PersonIdentityModel;
  let averell: PersonIdentityModel;

  beforeEach(() => {
    participationService = jasmine.createSpyObj<ParticipationService>('ParticipationService', [
      'listParticipants'
    ]);
    activityService = jasmine.createSpyObj<ActivityService>('ActivityService', [
      'create',
      'update'
    ]);
    personService = jasmine.createSpyObj<PersonService>('PersonService', ['list']);

    joe = {
      id: 1,
      firstName: 'Joe',
      lastName: 'Dalton1'
    } as PersonIdentityModel;
    jack = {
      id: 2,
      firstName: 'Jack',
      lastName: 'Dalton2'
    } as PersonIdentityModel;
    william = {
      id: 3,
      firstName: 'William',
      lastName: 'Dalton3'
    } as PersonIdentityModel;
    averell = {
      id: 4,
      firstName: 'Averell',
      lastName: 'Dalton4'
    } as PersonIdentityModel;

    personService.list.and.returnValue(
      of([{ ...joe }, { ...jack }, { ...william }, { ...averell }])
    );
    participationService.listParticipants.and.callFake((type: ActivityType) => {
      if (type === 'MEAL') {
        return of([{ ...william }, { ...averell }]);
      } else if (type === 'HEALTH_MEDIATION') {
        return of([{ ...jack }, { ...william }]);
      } else {
        throw new Error('unexpected activity type');
      }
    });
  });

  describe('in create mode', () => {
    beforeEach(() => {
      const route = fakeRoute({
        snapshot: fakeSnapshot({
          data: {}
        })
      });
      configureTestingModule(route);
      tester = new ActivityEditComponentTester();
      tester.detectChanges();
    });

    it('should have a title', () => {
      expect(tester.title).toContainText('Créer une activité');
    });

    it('should have an empty form', () => {
      expect(tester.type).toHaveSelectedLabel('');
      expect(tester.date).toHaveValue('');
      expect(tester.presentItems.length).toBe(0);
      expect(tester.absentItems.length).toBe(0);
    });

    it('should not save if invalid', () => {
      tester.saveButton.click();

      expect(activityService.create).not.toHaveBeenCalled();
      expect(tester.errors.length).toBe(2);
    });

    it('should populate absent and present list', () => {
      expect(tester.presentItems.length).toBe(0);

      tester.type.selectLabel('Repas');

      expect(tester.absentItems.length).toBe(2);
      expect(tester.absentItems[0]).toContainText('DALTON3 William');
      expect(tester.absentItems[1]).toContainText('DALTON4 Averell');

      tester.type.selectLabel('Médiation santé');
      expect(tester.absentItems.length).toBe(2);
      expect(tester.absentItems[0]).toContainText('DALTON2 Jack');
      expect(tester.absentItems[1]).toContainText('DALTON3 William');

      tester.showAllPersons.check();
      expect(tester.absentItems.length).toBe(4);
      expect(tester.absentItems[0]).toContainText('DALTON1 Joe');
      expect(tester.absentItems[1]).toContainText('DALTON2 Jack');
      expect(tester.absentItems[2]).toContainText('DALTON3 William');
      expect(tester.absentItems[3]).toContainText('DALTON4 Averell');

      tester.addPresentButtons[2].click();
      expect(tester.absentItems.length).toBe(3);
      expect(tester.absentItems[0]).toContainText('DALTON1 Joe');
      expect(tester.absentItems[1]).toContainText('DALTON2 Jack');
      expect(tester.absentItems[2]).toContainText('DALTON4 Averell');

      expect(tester.presentItems.length).toBe(1);
      expect(tester.presentItems[0]).toContainText('DALTON3 William');

      tester.addPresentButtons[0].click();
      expect(tester.absentItems.length).toBe(2);
      expect(tester.absentItems[0]).toContainText('DALTON2 Jack');
      expect(tester.absentItems[1]).toContainText('DALTON4 Averell');

      expect(tester.presentItems.length).toBe(2);
      expect(tester.presentItems[0]).toContainText('DALTON1 Joe');
      expect(tester.presentItems[1]).toContainText('DALTON3 William');

      tester.showAllPersons.uncheck();
      expect(tester.absentItems.length).toBe(1);
      expect(tester.absentItems[0]).toContainText('DALTON2 Jack');

      tester.removePresentButtons[0].click();
      expect(tester.absentItems.length).toBe(1);
      expect(tester.absentItems[0]).toContainText('DALTON2 Jack');

      expect(tester.presentItems.length).toBe(1);
      expect(tester.presentItems[0]).toContainText('DALTON3 William');

      tester.removePresentButtons[0].click();
      expect(tester.absentItems.length).toBe(2);
      expect(tester.absentItems[0]).toContainText('DALTON2 Jack');
      expect(tester.absentItems[1]).toContainText('DALTON3 William');

      expect(tester.presentItems.length).toBe(0);
    });

    it('should switch to start with first name', () => {
      expect(tester.presentItems.length).toBe(0);

      tester.type.selectLabel('Repas');
      tester.showAllPersons.check();

      expect(tester.absentItems.length).toBe(4);
      expect(tester.absentItems[0]).toContainText('DALTON1 Joe');
      expect(tester.absentItems[1]).toContainText('DALTON2 Jack');
      expect(tester.absentItems[2]).toContainText('DALTON3 William');
      expect(tester.absentItems[3]).toContainText('DALTON4 Averell');

      tester.addPresentButtons[1].click();
      tester.addPresentButtons[1].click();
      expect(tester.absentItems.length).toBe(2);
      expect(tester.absentItems[0]).toContainText('DALTON1 Joe');
      expect(tester.absentItems[1]).toContainText('DALTON4 Averell');

      expect(tester.presentItems.length).toBe(2);
      expect(tester.presentItems[0]).toContainText('DALTON2 Jack');
      expect(tester.presentItems[1]).toContainText('DALTON3 William');

      tester.startWithFirstName.check();
      expect(tester.absentItems[0]).toContainText('Averell Dalton4');
      expect(tester.absentItems[1]).toContainText('Joe Dalton1');

      expect(tester.presentItems[0]).toContainText('Jack Dalton2');
      expect(tester.presentItems[1]).toContainText('William Dalton3');

      tester.addPresentButtons[0].click();
      expect(tester.presentItems[0]).toContainText('Averell Dalton4');
      expect(tester.presentItems[1]).toContainText('Jack Dalton2');
      expect(tester.presentItems[2]).toContainText('William Dalton3');

      tester.startWithFirstName.uncheck();
      expect(tester.presentItems[0]).toContainText('DALTON2 Jack');
      expect(tester.presentItems[1]).toContainText('DALTON3 William');
      expect(tester.presentItems[2]).toContainText('DALTON4 Averell');
    });

    it('should save', () => {
      tester.type.selectLabel('Repas');
      tester.date.fillWith('12/05/2021');
      tester.addPresentButtons[0].click();
      tester.addPresentButtons[0].click();

      activityService.create.and.returnValue(of({ id: 42 } as Activity));

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      tester.saveButton.click();

      expect(activityService.create).toHaveBeenCalledWith({
        type: 'MEAL',
        date: '2021-05-12',
        participantIds: [william.id, averell.id]
      });
      expect(router.navigate).toHaveBeenCalledWith(['/activities', 42]);
    });
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      const route = fakeRoute({
        snapshot: fakeSnapshot({
          data: {
            activity: {
              id: 22,
              date: '2021-01-02',
              type: activityType('MEAL'),
              participants: [{ ...william }, { ...joe }]
            } as Activity
          }
        })
      });
      configureTestingModule(route);
      tester = new ActivityEditComponentTester();
      tester.detectChanges();
    });

    it('should have a title', () => {
      expect(tester.title).toContainText('Modifier une activité');
    });

    it('should have a filled form', () => {
      expect(tester.type).toHaveSelectedLabel('Repas');
      expect(tester.date).toHaveValue('02/01/2021');
      expect(tester.presentItems.length).toBe(2);
      expect(tester.presentItems[0]).toContainText('DALTON1 Joe');
      expect(tester.presentItems[1]).toContainText('DALTON3 William');

      expect(tester.absentItems.length).toBe(1);
      expect(tester.absentItems[0]).toContainText('DALTON4 Averell');
    });

    it('should save', () => {
      tester.type.selectLabel('Médiation santé');
      tester.date.fillWith('12/05/2021');

      activityService.update.and.returnValue(of(undefined));

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      tester.saveButton.click();

      expect(activityService.update).toHaveBeenCalledWith(22, {
        type: 'HEALTH_MEDIATION',
        date: '2021-05-12',
        participantIds: [joe.id, william.id]
      });
      expect(router.navigate).toHaveBeenCalledWith(['/activities', 22]);
    });
  });
});
