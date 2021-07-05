import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PersonModel } from './models/person.model';
import { PersonService } from './person.service';

/**
 * Service used to hold the person displayed by the person layout component and all its children.
 * It allows the child components to trigger a refresh if needed.
 * It's not provided by the person layout component because it's injected into its resolver
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentPersonService {
  private personSubject = new BehaviorSubject<PersonModel>(null);

  constructor(private personService: PersonService) {}

  /**
   * Reloads the person, emits once loaded, then completes. And of course causes a new person
   * to be emitted by the personChanges$ observable.
   */
  refresh(personId: number): Observable<PersonModel> {
    return this.personService.get(personId).pipe(tap(person => this.personSubject.next(person)));
  }

  /**
   * Gets a hot observable which emits every time the currnt person is refreshed, and emits immediately when subscribed, too.
   */
  get personChanges$(): Observable<PersonModel> {
    return this.personSubject.asObservable();
  }

  /**
   * Gets the current person. Since all person-related components are only activated once the parent component resolver
   * has returned, this is fine, unless the component stays active and needs to be refreshed.
   */
  get snapshot(): PersonModel {
    return this.personSubject.getValue();
  }
}
