import { TestBed } from '@angular/core/testing';

import { PersonWeddingEventsComponent } from './person-wedding-events.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { PersonModel } from '../models/person.model';
import { WEDDING_EVENT_TYPES, WeddingEventModel } from '../models/wedding-event.model';
import { WeddingEventService } from '../wedding-event.service';
import { DisplayWeddingEventTypePipe } from '../display-wedding-event-type.pipe';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '../confirm.service';
import { EMPTY, of } from 'rxjs';
import { DateTime } from 'luxon';
import { LOCALE_ID } from '@angular/core';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { DisplayLocationPipe } from '../display-location.pipe';
import { ComponentTester, createMock, stubRoute } from 'ngx-speculoos';
import { Location, LOCATIONS } from '../models/family.model';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';
import { CurrentPersonService } from '../current-person.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeddingEventCommand } from '../models/wedding-event.command';
import Spy = jasmine.Spy;

class PersonWeddingEventsComponentTester extends ComponentTester<PersonWeddingEventsComponent> {
  constructor() {
    super(PersonWeddingEventsComponent);
  }

  get events() {
    return this.elements('.event-item');
  }

  get deleteButtons() {
    return this.elements<HTMLButtonElement>('.event-item button');
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
    return this.input(`#location-${location}`);
  }

  get createButton() {
    return this.button('#createButton');
  }
}

describe('PersonWeddingEventsComponent', () => {
  let events: Array<WeddingEventModel>;
  let person: PersonModel;
  let route: ActivatedRoute;

  let tester: PersonWeddingEventsComponentTester;

  beforeEach(() => {
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

    route = stubRoute({
      data: { events }
    });

    const weddingEventService = createMock(WeddingEventService);
    const confirmService = createMock(ConfirmService);

    TestBed.configureTestingModule({
      declarations: [
        PersonWeddingEventsComponent,
        DisplayWeddingEventTypePipe,
        ValidationDefaultsComponent,
        DisplayLocationPipe,
        PageTitleDirective,
        FullnamePipe
      ],
      imports: [
        ReactiveFormsModule,
        GlobeNgbTestingModule,
        ValdemortModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        { provide: ActivatedRoute, useFactory: () => route },
        { provide: WeddingEventService, useValue: weddingEventService },
        { provide: ConfirmService, useValue: confirmService }
      ]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue(person);

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    tester = new PersonWeddingEventsComponentTester();
  });

  afterEach(() => jasmine.clock().uninstall());

  describe('logic', () => {
    let component: PersonWeddingEventsComponent;

    beforeEach(() => {
      component = tester.componentInstance;
    });

    it('should expose events and event types, and not have a form initially', () => {
      expect(component.events).toBe(events);
      expect(component.eventTypes).toBe(WEDDING_EVENT_TYPES);
      expect(component.locations).toBe(LOCATIONS);
      expect(component.newEvent).toBeNull();
    });

    it('should delete an event after confirmation and reload the list', () => {
      const confirmService = TestBed.inject(ConfirmService);
      const weddingEventService = TestBed.inject(WeddingEventService);

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
      const confirmService = TestBed.inject(ConfirmService);
      const weddingEventService = TestBed.inject(WeddingEventService);

      (confirmService.confirm as Spy).and.returnValue(EMPTY);

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
        month: 4,
        day: 1
      });

      expect(component.newEvent).not.toBeNull();
    });

    it('should not create if form is invalid', () => {
      component.showEventCreation();
      component.create();

      const weddingEventService = TestBed.inject(WeddingEventService);
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
      const newEvents: Array<WeddingEventModel> = [newEvent];

      const weddingEventService = TestBed.inject(WeddingEventService);
      (weddingEventService.create as Spy).and.returnValue(of(newEvent));
      (weddingEventService.list as Spy).and.returnValue(of(newEvents));

      component.create();

      expect(weddingEventService.create).toHaveBeenCalledWith(
        person.id,
        command as WeddingEventCommand
      );
      expect(component.events).toEqual(newEvents);
      expect(component.newEvent).toBeNull();
    });
  });

  describe('UI', () => {
    beforeEach(() => {
      tester.detectChanges();
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

      expect(tester.componentInstance.deleteEvent).toHaveBeenCalledWith(
        tester.componentInstance.events[0]
      );
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
      expect(tester.testElement).not.toContainText("Le type d'événement est obligatoire");
      expect(tester.testElement).not.toContainText('La date doit être dans le passé');
      expect(tester.testElement).not.toContainText('Le lieu est obligatoire');

      tester.createButton.click();

      expect(tester.testElement).toContainText('La date est obligatoire');
      expect(tester.testElement).toContainText("Le type d'événement est obligatoire");
      expect(tester.testElement).not.toContainText('La date doit être dans le passé');
      expect(tester.testElement).toContainText('Le lieu est obligatoire');

      tester.dateInput.fillWith('2050-03-28');
      tester.typeSelect.selectValue('WEDDING');
      tester.locationInput('FRANCE').check();

      expect(tester.testElement).not.toContainText('La date est obligatoire');
      expect(tester.testElement).not.toContainText("Le type d'événement est obligatoire");
      expect(tester.testElement).toContainText('La date doit être dans le passé');
      expect(tester.testElement).not.toContainText('Le lieu est obligatoire');
    });
  });
});
