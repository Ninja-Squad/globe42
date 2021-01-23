import { TestBed } from '@angular/core/testing';

import { PersonRemindersComponent } from './person-reminders.component';
import { Component, LOCALE_ID } from '@angular/core';
import { ReminderModel } from '../models/person.model';
import { ComponentTester } from 'ngx-speculoos';

@Component({
  template: '<gl-person-reminders [reminders]="reminders"></gl-person-reminders>'
})
class TestComponent {
  reminders: Array<ReminderModel> = [
    { type: 'HEALTH_INSURANCE_TO_RENEW', endDate: '2021-01-23' },
    { type: 'HEALTH_CHECK_TO_PLAN', lastDate: '2021-01-23' },
    { type: 'HEALTH_CHECK_TO_PLAN', lastDate: null },
    { type: 'RESIDENCE_PERMIT_TO_RENEW', endDate: '2021-01-23' },
    { type: 'MEMBERSHIP_TO_RENEW' },
    { type: 'MEMBERSHIP_PAYMENT_OUT_OF_DATE' }
  ];
}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get items() {
    return this.elements('.reminder-item');
  }
}

describe('PersonRemindersComponent', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonRemindersComponent, TestComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });

    tester = new TestComponentTester();
    tester.detectChanges();
  });

  it('should display reminders', () => {
    expect(tester.items.length).toBe(6);
    expect(tester.items[0]).toContainText(
      'La couverture médicale complémentaire doit être renouvelée.'
    );
    expect(tester.items[0]).toContainText('Elle arrive à échéance le 23 janvier 2021.');

    expect(tester.items[1]).toContainText('Un nouveau bilan de santé doit être planifié.');
    expect(tester.items[1]).toContainText('Le dernier date du 23 janvier 2021.');

    expect(tester.items[2]).toContainText('Un nouveau bilan de santé doit être planifié.');
    expect(tester.items[2]).toContainText('La date du dernier bilan est inconnue.');

    expect(tester.items[3]).toContainText('Le titre de séjour doit être renouvelé.');
    expect(tester.items[3]).toContainText('Il arrive à échéance le 23 janvier 2021.');

    expect(tester.items[4]).toContainText("Pas d'adhésion pour l'année en cours.");

    expect(tester.items[5]).toContainText(
      "Le paiement de l'adhésion pour l'année en cours n'est pas à jour."
    );
  });
});
