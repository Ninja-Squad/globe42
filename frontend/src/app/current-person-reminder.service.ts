import { Injectable } from '@angular/core';
import { concat, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ReminderModel } from './models/person.model';

/**
 * Service provided by the parent person-layout component, which is used to get the
 * reminders for the current person. Child components notify this service when they edit the user
 * in a way that is potentially modifying the reminders, so that the reminders are refreshed
 */
@Injectable()
export class CurrentPersonReminderService {
  private refreshSubject = new Subject<void>();
  private reminders$: Observable<Array<ReminderModel>>;

  constructor(private http: HttpClient) {}

  /**
   * Returns an observable which emits the reminders of the given person, which are obtained
   * when the returned observable is being subscribed, and every time the refresh method is being
   * called
   */
  initialize(personId: number): Observable<Array<ReminderModel>> {
    const currentReminders$ = this.http.get<Array<ReminderModel>>(
      `/api/persons/${personId}/reminders`
    );
    const futureReminders$ = this.refreshSubject.pipe(switchMap(() => currentReminders$));
    this.reminders$ = concat(currentReminders$, futureReminders$).pipe(shareReplay());
    return this.reminders$;
  }

  /**
   * Triggers a refresh of the reminders
   */
  refresh() {
    this.refreshSubject.next();
  }
}
