import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PersonIdentityModel, PersonModel } from './models/person.model';
import { PersonService } from './person.service';

@Injectable()
export class PersonsResolverService implements Resolve<Array<PersonModel>> {

  constructor(private personService: PersonService) { }

  resolve(): Observable<Array<PersonIdentityModel>> {
    return this.personService.list();
  }
}
