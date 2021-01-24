import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonWithRemindersModel, REMINDER_TYPES, ReminderType } from '../models/person.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'gl-persons-with-reminders',
  templateUrl: './persons-with-reminders.component.html',
  styleUrls: ['./persons-with-reminders.component.scss']
})
export class PersonsWithRemindersComponent implements OnInit {
  form: FormGroup;
  unfilteredPersons: Array<PersonWithRemindersModel>;
  filteredPersons: Array<PersonWithRemindersModel>;
  reminderTypes = REMINDER_TYPES;

  constructor(fb: FormBuilder, private route: ActivatedRoute) {
    this.form = new FormGroup({});
    REMINDER_TYPES.forEach(type =>
      this.form.addControl(
        type,
        new FormControl(type !== 'MEMBERSHIP_TO_RENEW' && type !== 'MEMBERSHIP_PAYMENT_OUT_OF_DATE')
      )
    );

    this.form.valueChanges.subscribe(() => (this.filteredPersons = this.filterPersons()));
  }

  ngOnInit(): void {
    this.unfilteredPersons = this.route.snapshot.data.persons;
    this.filteredPersons = this.filterPersons();
  }

  private filterPersons(): Array<PersonWithRemindersModel> {
    const formValue: Record<ReminderType, boolean> = this.form.value;
    return this.unfilteredPersons
      .filter(p => p.reminders.some(reminder => formValue[reminder.type]))
      .map(p => ({ ...p, reminders: p.reminders.filter(reminder => formValue[reminder.type]) }));
  }
}
