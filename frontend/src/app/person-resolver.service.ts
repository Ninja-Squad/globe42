import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { PersonModel } from './models/person.model';
import { CurrentPersonService } from './current-person.service';

@Injectable({ providedIn: 'root' })
export class PersonResolverService implements Resolve<PersonModel> {
  constructor(private personLayoutService: CurrentPersonService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PersonModel> {
    const personId = +route.paramMap.get('id');
    return this.personLayoutService.refresh(personId);
  }
}
