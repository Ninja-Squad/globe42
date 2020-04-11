import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { PersonIdentityModel } from './models/person.model';
import { PersonService } from './person.service';

@Injectable({ providedIn: 'root' })
export class PersonsResolverService implements Resolve<Array<PersonIdentityModel>> {
  constructor(private personService: PersonService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Array<PersonIdentityModel>> {
    const listType = route.data.personListType;
    return listType === 'deleted' ? this.personService.listDeleted() : this.personService.list();
  }
}
