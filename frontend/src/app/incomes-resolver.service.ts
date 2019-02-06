import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IncomeModel } from './models/income.model';
import { Observable } from 'rxjs';
import { PersonModel } from './models/person.model';
import { IncomeService } from './income.service';

/**
 * Resolves the incomes of a person
 */
@Injectable({ providedIn: 'root' })
export class IncomesResolverService implements Resolve<Array<IncomeModel>> {

  constructor(private incomeService: IncomeService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<IncomeModel>> {
    const person: PersonModel = route.parent.data.person;
    return this.incomeService.list(person.id);
  }
}
