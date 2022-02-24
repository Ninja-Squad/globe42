import { TestBed } from '@angular/core/testing';

import { PersonsWithRemindersComponent } from './persons-with-reminders.component';
import { ComponentTester, stubRoute } from 'ngx-speculoos';
import { PersonWithRemindersModel, ReminderType } from '../models/person.model';
import { PersonRemindersComponent } from '../person-reminders/person-reminders.component';
import { DisplayReminderTypePipe } from '../display-reminder-type.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FullnamePipe } from '../fullname.pipe';
import { RouterTestingModule } from '@angular/router/testing';

class PersonsWithRemindersComponentTester extends ComponentTester<PersonsWithRemindersComponent> {
  constructor() {
    super(PersonsWithRemindersComponent);
  }

  reminderTypeCheckbox(type: ReminderType) {
    return this.input(`#reminder-type-${type}`);
  }

  get personItems() {
    return this.elements('.person-item');
  }

  get reminders(): Array<PersonRemindersComponent> {
    return this.personItems.map(item => item.component(PersonRemindersComponent));
  }
}

describe('PersonsWithRemindersComponent', () => {
  let tester: PersonsWithRemindersComponentTester;

  beforeEach(() => {
    const persons = [
      {
        id: 1,
        firstName: 'Claire',
        lastName: 'Brucy',
        mediationCode: 'B1',
        email: 'claire@mail.com',
        phoneNumber: '0987654321',
        reminders: [
          {
            type: 'HEALTH_INSURANCE_TO_RENEW',
            endDate: '2020-12-12'
          },
          {
            type: 'RESIDENCE_PERMIT_TO_RENEW',
            endDate: '2020-12-13'
          },
          {
            type: 'MEMBERSHIP_TO_RENEW'
          }
        ]
      },
      {
        id: 2,
        firstName: 'JB',
        lastName: 'Nizet',
        mediationCode: null,
        email: null,
        phoneNumber: null,
        reminders: [
          {
            type: 'MEMBERSHIP_TO_RENEW'
          }
        ]
      }
    ] as Array<PersonWithRemindersModel>;

    const route = stubRoute({
      data: { persons }
    });

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [
        PersonsWithRemindersComponent,
        PersonRemindersComponent,
        DisplayReminderTypePipe,
        FullnamePipe
      ],
      providers: [{ provide: ActivatedRoute, useValue: route }]
    });

    tester = new PersonsWithRemindersComponentTester();
    tester.detectChanges();
  });

  it('should display a filter form with membership reminders unchecked', () => {
    expect(tester.reminderTypeCheckbox('HEALTH_INSURANCE_TO_RENEW')).toBeChecked();
    expect(tester.reminderTypeCheckbox('RESIDENCE_PERMIT_TO_RENEW')).toBeChecked();
    expect(tester.reminderTypeCheckbox('HEALTH_CHECK_TO_PLAN')).toBeChecked();
    expect(tester.reminderTypeCheckbox('MEMBERSHIP_TO_RENEW')).not.toBeChecked();
    expect(tester.reminderTypeCheckbox('MEMBERSHIP_PAYMENT_OUT_OF_DATE')).not.toBeChecked();
  });

  it('should filter initially', () => {
    expect(tester.personItems.length).toBe(1);
    expect(tester.personItems[0]).toContainText('Claire Brucy');
    expect(tester.personItems[0]).toContainText('B1');
    expect(tester.personItems[0]).toContainText('claire@mail.com');
    expect(tester.personItems[0]).toContainText('0987654321');
    expect(tester.reminders[0].reminders.length).toBe(2);
    expect(tester.reminders[0].reminders[0].type).toBe('HEALTH_INSURANCE_TO_RENEW');
    expect(tester.reminders[0].reminders[1].type).toBe('RESIDENCE_PERMIT_TO_RENEW');
  });

  it('should filter', () => {
    tester.reminderTypeCheckbox('HEALTH_INSURANCE_TO_RENEW').uncheck();
    tester.reminderTypeCheckbox('MEMBERSHIP_TO_RENEW').check();

    expect(tester.personItems.length).toBe(2);
    expect(tester.reminders[0].reminders.length).toBe(2);
    expect(tester.reminders[0].reminders[0].type).toBe('RESIDENCE_PERMIT_TO_RENEW');
    expect(tester.reminders[0].reminders[1].type).toBe('MEMBERSHIP_TO_RENEW');
    expect(tester.reminders[1].reminders.length).toBe(1);
    expect(tester.reminders[1].reminders[0].type).toBe('MEMBERSHIP_TO_RENEW');
  });
});
