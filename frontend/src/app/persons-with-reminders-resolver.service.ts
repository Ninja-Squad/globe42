import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PersonService } from './person.service';
import { Observable } from 'rxjs';
import { PersonWithRemindersModel } from './models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonsWithRemindersResolverService
  implements Resolve<Array<PersonWithRemindersModel>> {
  constructor(private personService: PersonService) {}

  resolve(): Observable<Array<PersonWithRemindersModel>> {
    return this.personService.listWithReminders();
  }
}
