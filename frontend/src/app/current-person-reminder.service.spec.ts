import { TestBed } from '@angular/core/testing';

import { CurrentPersonReminderService } from './current-person-reminder.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReminderModel } from './models/person.model';

describe('CurrentPersonReminderService', () => {
  let service: CurrentPersonReminderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrentPersonReminderService]
    });

    service = TestBed.inject(CurrentPersonReminderService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should initialize, cache latest reminders, and refresh', () => {
    const reminders$ = service.initialize(42);

    const backendReminders1: Array<ReminderModel> = [{ type: 'MEMBERSHIP_TO_RENEW' }];

    let actualReminders1: Array<ReminderModel>;
    let actualReminders2: Array<ReminderModel>;

    reminders$.subscribe(r => (actualReminders1 = r));
    reminders$.subscribe(r => (actualReminders2 = r));

    http.expectOne({ method: 'GET', url: '/api/persons/42/reminders' }).flush(backendReminders1);

    expect(actualReminders1).toBe(backendReminders1);
    expect(actualReminders2).toBe(backendReminders1);

    const backendReminders2: Array<ReminderModel> = [{ type: 'MEMBERSHIP_PAYMENT_OUT_OF_DATE' }];
    service.refresh();
    http.expectOne({ method: 'GET', url: '/api/persons/42/reminders' }).flush(backendReminders2);
    expect(actualReminders1).toBe(backendReminders2);
    expect(actualReminders2).toBe(backendReminders2);

    let actualReminders3: Array<ReminderModel>;
    reminders$.subscribe(r => (actualReminders3 = r));
    expect(actualReminders3).toBe(backendReminders2);
  });
});
