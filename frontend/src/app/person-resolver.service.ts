import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PersonModel } from './models/person.model';
import { PersonService } from './person.service';

@Injectable()
export class PersonResolverService implements Resolve<PersonModel> {

  constructor(private personService: PersonService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PersonModel> {
    const personId = +route.paramMap.get('id');
    return this.personService.get(personId);
  }

}
