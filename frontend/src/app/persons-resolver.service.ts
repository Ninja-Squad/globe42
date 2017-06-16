import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PersonModel } from './models/person.model';
import { PersonService } from './person.service';

@Injectable()
export class PersonsResolverService {

  constructor(private personService: PersonService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<PersonModel>> {
    return this.personService.list();
  }

}
