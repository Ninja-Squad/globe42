import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PersonIdentityModel } from './models/person.model';
import { PersonService } from './person.service';

@Injectable()
export class PersonsResolverService implements Resolve<Array<PersonIdentityModel>> {

  constructor(private personService: PersonService) { }

  resolve(): Observable<Array<PersonIdentityModel>> {
    return this.personService.list();
  }
}
