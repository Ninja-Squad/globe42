import { async, TestBed } from '@angular/core/testing';

import { PersonWeddingEventsComponent } from './person-wedding-events.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { PersonModel } from '../models/person.model';
import { WeddingEventModel } from '../models/wedding-event.model';
import { WeddingEventService } from '../wedding-event.service';
import { DisplayWeddingEventTypePipe, WEDDING_EVENT_TYPE_TRANSLATIONS } from '../display-wedding-event-type.pipe';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '../confirm.service';
import { of, throwError } from 'rxjs';
import { DateTime } from 'luxon';
import { LOCALE_ID } from '@angular/core';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { DisplayLocationPipe, LOCATION_TRANSLATIONS } from '../display-location.pipe';
import { ComponentTester, speculoosMatchers, TestButton } from 'ngx-speculoos';
import { Location } from '../models/family.model';
import { PageTitleDirective } from '../page-title.directive';
import Spy = jasmine.Spy;
import { FullnamePipe } from '../fullname.pipe';

class PersonWeddingEventsComponentTester extends ComponentTester<PersonWeddingEventsComponent> {
  constructor() {
    super(PersonWeddingEventsComponent);
  }

  get events() {
    return this.elements('.event-item');
  }

  get deleteButtons() {
    return this.elements('.event-item button') as Array<TestButton>;
  }

  get newEventButton() {
    return this.button('#newEventButton');
  }

  get form() {
    return this.element('form');
  }

  get cancelCreationButton() {
    return this.button('#cancelCreationButton');
  }

  get dateInput() {
    return this.input('#date');
  }

  get typeSelect() {
    return this.select('#type');
  }

  locationInput(location: Location) {
    return this.input(`#location${location}`);
  }

  get createButton() {
    return this.button('#createButton');
  }
}

describe('PersonWeddingEventsComponent', () => {
  let events: Array<WeddingEventModel>;
  let person: PersonModel;
  let route: any;

  beforeEach(async(() => {
    jasmine.clock().mockDate(DateTime.fromISO('2018-03-25T15:30:00').toJSDate());

    events = [
      {
        id: 42,
        date: '2001-02-28',
        type: 'WEDDING',
        location: 'ABROAD'
      },
      {
        id: 43,
        date: '2003-03-29',
        type: 'DIVORCE',
        location: 'FRANCE'
      }
    ];

    person = { id: 1, firstName: 'JB', lastName: 'Nizet' } as PersonModel;

    route = {
      parent: {snapshot: {data: {person}}},
      snapshot: {data: {events}}
    };

    const weddingEventService: WeddingEventService =
      jasmine.createSpyObj('weddingEventService', ['list', 'create', 'delete']);
    const confirmService: ConfirmService =
      jasmine.createSpyObj('confirmService', ['confirm']);

    TestBed.configureTestingModule({
      declarations: [
        PersonWeddingEventsComponent,
        DisplayWeddingEventTypePipe,
        ValidationDefaultsComponent,
        DisplayLocationPipe,
        PageTitleDirective,
        FullnamePipe
      ],
      imports: [ ReactiveFormsModule, GlobeNgbModule.forRoot(), ValdemortModule ],
      providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        { provide: ActivatedRoute, useFactory: () => route },
        { provide: WeddingEventService, useValue: weddingEventService },
        { provide: ConfirmService, useValue: confirmService },
      ]
    });

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
  }));

  afterEach(() => jasmine.clock().uninstall());

  describe('logic', () => {
    let component: PersonWeddingEventsComponent;

    beforeEach(() => {
      component = TestBed.createComponent(PersonWeddingEventsComponent).componentInstance;
    });

    it('should expose events and event types, and not have a form initially', () => {
      expect(component.events).toBe(events);
      expect(component.eventTypes).toBe(WEDDING_EVENT_TYPE_TRANSLATIONS);
      expect(component.locations).toBe(LOCATION_TRANSLATIONS);
      expect(component.newEvent).toBeNull();
    });

    it('should delete an event after confirmation and reload the list', () => {
      const confirmService = TestBed.get(ConfirmService);
      const weddingEventService = TestBed.get(WeddingEventService);

      (confirmService.confirm as Spy).and.returnValue(of(null));
      (weddingEventService.delete as Spy).and.returnValue(of(null));

      const newEvents: Array<WeddingEventModel> = [
        {
          id: 42,
          date: '2001-02-28',
          type: 'WEDDING',
          location: 'ABROAD'
        }
      ];
      (weddingEventService.list as Spy).and.returnValue(of(newEvents));

      component.deleteEvent(events[1]);
      expect(component.events).toEqual(newEvents);

      expect(confirmService.confirm).toHaveBeenCalled();
      expect(weddingEventService.delete).toHaveBeenCalledWith(person.id, events[1].id);
      expect(weddingEventService.list).toHaveBeenCalledWith(person.id);
    });

    it('should not delete an event if not confirmed', () => {
      const confirmService = TestBed.get(ConfirmService);
      const weddingEventService = TestBed.get(WeddingEventService);

      (confirmService.confirm as Spy).and.returnValue(throwError(null));

      component.deleteEvent(events[1]);
      expect(component.events).toEqual(events);

      expect(confirmService.confirm).toHaveBeenCalled();
      expect(weddingEventService.delete).not.toHaveBeenCalled();
      expect(weddingEventService.list).not.toHaveBeenCalled();
    });

    it('should show creation form and set max month', () => {
      component.showEventCreation();

      expect(component.maxMonth).toEqual({
        year: 2018,
        month: 4
      });

      expect(component.newEvent).not.toBeNull();
    });

    it('should not create if form is invalid', () => {
      component.showEventCreation();
      component.create();

      const weddingEventService = TestBed.get(WeddingEventService);
      expect(weddingEventService.create).not.toHaveBeenCalled();
    });

    it('should create if form is valid', () => {
      component.showEventCreation();
      const command = {
        date: '2016-02-28',
        type: 'WEDDING',
        location: 'FRANCE'
      };
      component.newEvent.setValue(command);

      const newEvent: WeddingEventModel = {
        id: 42,
        date: '2016-02-28',
        type: 'WEDDING',
        location: 'FRANCE'
      };
      const newEvents: Array<WeddingEventModel> = [ newEvent ];

      const weddingEventService = TestBed.get(WeddingEventService);
      (weddingEventService.create as Spy).and.returnValue(of(newEvent));
      (weddingEventService.list as Spy).and.returnValue(of(newEvents));

      component.create();

      expect(weddingEventService.create).toHaveBeenCalledWith(person.id, command);
      expect(component.events).toEqual(newEvents);
      expect(component.newEvent).toBeNull();
    });
  });

  describe('UI', () => {
    let tester: PersonWeddingEventsComponentTester;

    beforeEach(() => {
      tester = new PersonWeddingEventsComponentTester();
      tester.detectChanges();

      jasmine.addMatchers(speculoosMatchers);
    });

    it('should list events', () => {
      const items = tester.events;
      expect(items.length).toBe(2);
      expect(items[0]).toContainText('28 févr. 2001');
      expect(items[0]).toContainText('Mariage au Pays');
    });

    it('should delete and event', () => {
      spyOn(tester.componentInstance, 'deleteEvent');
      tester.deleteButtons[0].click();

      expect(tester.componentInstance.deleteEvent).toHaveBeenCalledWith(tester.componentInstance.events[0]);
    });

    it('should show creation form when clicking button, and hide it when cancelling', () => {
      expect(tester.form).toBeNull();

      tester.newEventButton.click();

      expect(tester.form).not.toBeNull();

      tester.cancelCreationButton.click();

      expect(tester.form).toBeNull();
    });

    it('should create new event', () => {
      tester.newEventButton.click();

      tester.dateInput.fillWith('2017-03-28');
      tester.typeSelect.selectValue('WEDDING');
      tester.locationInput('FRANCE').check();

      spyOn(tester.componentInstance, 'create');

      tester.createButton.click();

      expect(tester.componentInstance.create).toHaveBeenCalled();
      expect(tester.componentInstance.newEvent.value).toEqual({
        date: '2017-03-28',
        type: 'WEDDING',
        location: 'FRANCE'
      });
    });

    it('should show error messages', () => {
      tester.newEventButton.click();

      expect(tester.testElement).not.toContainText('La date est obligatoire');
      expect(tester.testElement).not.toContainText('Le type d\'événement est obligatoire');
      expect(tester.testElement).not.toContainText('La date doit être dans le passé');
      expect(tester.testElement).not.toContainText('Le lieu est obligatoire');

      tester.createButton.click();

      expect(tester.testElement).toContainText('La date est obligatoire');
      expect(tester.testElement).toContainText('Le type d\'événement est obligatoire');
      expect(tester.testElement).not.toContainText('La date doit être dans le passé');
      expect(tester.testElement).toContainText('Le lieu est obligatoire');

      tester.dateInput.fillWith('2050-03-28');
      tester.typeSelect.selectValue('WEDDING');
      tester.locationInput('FRANCE').check();

      expect(tester.testElement).not.toContainText('La date est obligatoire');
      expect(tester.testElement).not.toContainText('Le type d\'événement est obligatoire');
      expect(tester.testElement).toContainText('La date doit être dans le passé');
      expect(tester.testElement).not.toContainText('Le lieu est obligatoire');
    });
  });
});
