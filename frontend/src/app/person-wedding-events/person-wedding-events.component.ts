import { Component } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { ConfirmService } from '../confirm.service';
import { WeddingEventService } from '../wedding-event.service';
import { WEDDING_EVENT_TYPES, WeddingEventModel } from '../models/wedding-event.model';
import { pastDate } from '../globe-validators';
import { CurrentPersonService } from '../current-person.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LOCATIONS } from '../models/family.model';

@Component({
  selector: 'gl-person-wedding-events',
  templateUrl: './person-wedding-events.component.html',
  styleUrls: ['./person-wedding-events.component.scss']
})
export class PersonWeddingEventsComponent {
  events: Array<WeddingEventModel>;
  person: PersonModel;

  newEvent: FormGroup = null;
  maxMonth: NgbDateStruct;
  eventTypes = WEDDING_EVENT_TYPES;
  locations = LOCATIONS;

  constructor(
    route: ActivatedRoute,
    currentPersonService: CurrentPersonService,
    private weddingEventService: WeddingEventService,
    private formBuilder: FormBuilder,
    private confirmService: ConfirmService
  ) {
    this.person = currentPersonService.snapshot;
    this.events = route.snapshot.data.events;
  }

  deleteEvent(event: WeddingEventModel) {
    this.confirmService
      .confirm({
        message: 'Voulez-vous vraiment supprimer cet événement\u00a0?'
      })
      .pipe(
        switchMap(() => this.weddingEventService.delete(this.person.id, event.id)),
        switchMap(() => this.weddingEventService.list(this.person.id))
      )
      .subscribe(events => (this.events = events));
  }

  showEventCreation() {
    const nextMonth = DateTime.local().plus({ months: 1 });
    this.maxMonth = {
      year: nextMonth.year,
      month: nextMonth.month,
      day: 1
    };
    this.newEvent = this.formBuilder.group({
      date: [null, [Validators.required, pastDate]],
      type: [null, Validators.required],
      location: [null, Validators.required]
    });
  }

  create() {
    if (this.newEvent.invalid) {
      return;
    }

    this.weddingEventService
      .create(this.person.id, this.newEvent.value)
      .pipe(
        tap(() => (this.newEvent = null)),
        switchMap(() => this.weddingEventService.list(this.person.id))
      )
      .subscribe(events => (this.events = events));
  }
}
