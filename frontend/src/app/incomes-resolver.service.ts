import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IncomeModel } from './models/income.model';
import { Observable } from 'rxjs';
import { IncomeService } from './income.service';
import { CurrentPersonService } from './current-person.service';

/**
 * Resolves the incomes of a person
 */
@Injectable({ providedIn: 'root' })
export class IncomesResolverService implements Resolve<Array<IncomeModel>> {

  constructor(private currentPersonService: CurrentPersonService,
              private incomeService: IncomeService) { }

  resolve(): Observable<Array<IncomeModel>> {
    return this.incomeService.list(this.currentPersonService.snapshot.id);
  }
}
