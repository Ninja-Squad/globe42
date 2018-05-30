import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonWeddingEventsComponent } from './person-wedding-events.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { PersonModel } from '../models/person.model';
import { WeddingEventModel } from '../models/wedding-event.model';
import { WeddingEventService } from '../wedding-event.service';
import { DisplayWeddingEventTypePipe, WEDDING_EVENT_TYPE_TRANSLATIONS } from '../display-wedding-event-type.pipe';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '../confirm.service';
import Spy = jasmine.Spy;
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { DateTime } from 'luxon';
import { LOCALE_ID } from '@angular/core';
import { ValidationErrorDirective, ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

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
        type: 'WEDDING'
      },
      {
        id: 42,
        date: '2003-03-29',
        type: 'DIVORCE'
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
        ValidationErrorsComponent,
        ValidationErrorDirective
      ],
      imports: [ ReactiveFormsModule, GlobeNgbModule.forRoot() ],
      providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        { provide: ActivatedRoute, useFactory: () => route },
        { provide: WeddingEventService, useValue: weddingEventService },
        { provide: ConfirmService, useValue: confirmService },
      ]
    });
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
          type: 'WEDDING'
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
        type: 'WEDDING'
      };
      component.newEvent.setValue(command);

      const newEvent: WeddingEventModel = {
        id: 42,
        date: '2016-02-28',
        type: 'WEDDING'
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
    let fixture: ComponentFixture<PersonWeddingEventsComponent>;
    let component: PersonWeddingEventsComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(PersonWeddingEventsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should list events', () => {
      const items = fixture.nativeElement.querySelectorAll('.event-item');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toContain('28 févr. 2001');
      expect(items[0].textContent).toContain('Mariage');
    });

    it('should delete and event', () => {
      spyOn(component, 'deleteEvent');
      const firstDeleteButton = fixture.nativeElement.querySelector('.event-item button');
      firstDeleteButton.click();

      expect(component.deleteEvent).toHaveBeenCalledWith(component.events[0]);
    });

    it('should show creation form when clicking button, and hide it when cancelling', () => {
      let form = fixture.nativeElement.querySelector('form');
      expect(form).toBeFalsy();

      fixture.nativeElement.querySelector('#newEventButton').click();
      fixture.detectChanges();

      form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();

      fixture.nativeElement.querySelector('#cancelCreationButton').click();
      fixture.detectChanges();

      form = fixture.nativeElement.querySelector('form');
      expect(form).toBeFalsy();
    });

    it('should create new event', () => {
      fixture.nativeElement.querySelector('#newEventButton').click();
      fixture.detectChanges();

      const dateInput: HTMLInputElement = fixture.nativeElement.querySelector('#date');
      dateInput.value = '2017-03-28';
      dateInput.dispatchEvent(new Event('input'));

      const typeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('#type');
      typeSelect.selectedIndex = 1;
      typeSelect.dispatchEvent(new Event('change'));

      spyOn(component, 'create');
      fixture.nativeElement.querySelector('#createButton').click();
      fixture.detectChanges();

      expect(component.create).toHaveBeenCalled();
      expect(component.newEvent.value).toEqual({
        date: '2017-03-28',
        type: 'WEDDING'
      });
    });

    it('should show error messages', () => {
      fixture.nativeElement.querySelector('#newEventButton').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('La date est obligatoire');
      expect(fixture.nativeElement.textContent).not.toContain('Le type d\'événement est obligatoire');
      expect(fixture.nativeElement.textContent).not.toContain('La date doit être dans le passé');

      fixture.nativeElement.querySelector('#createButton').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('La date est obligatoire');
      expect(fixture.nativeElement.textContent).toContain('Le type d\'événement est obligatoire');
      expect(fixture.nativeElement.textContent).not.toContain('La date doit être dans le passé');

      const dateInput: HTMLInputElement = fixture.nativeElement.querySelector('#date');
      dateInput.value = '2020-03-28';
      dateInput.dispatchEvent(new Event('input'));

      const typeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('#type');
      typeSelect.selectedIndex = 1;
      typeSelect.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('La date est obligatoire');
      expect(fixture.nativeElement.textContent).not.toContain('Le type d\'événement est obligatoire');
      expect(fixture.nativeElement.textContent).toContain('La date doit être dans le passé');
    });
  });
});
