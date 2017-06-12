import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IncomeTypeModel } from './models/income.model';
import { IncomeService } from './income.service';

@Injectable()
export class IncomeTypesResolverService {

  constructor(private incomeService: IncomeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<IncomeTypeModel>> {
    return this.incomeService.listTypes();
  }

}
