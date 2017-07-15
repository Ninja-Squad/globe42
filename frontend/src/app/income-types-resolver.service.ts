import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IncomeSourceTypeModel } from './models/income.model';
import { IncomeService } from './income.service';

@Injectable()
export class IncomeTypesResolverService implements Resolve<Array<IncomeSourceTypeModel>> {

  constructor(private incomeService: IncomeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<IncomeSourceTypeModel>> {
    return this.incomeService.listTypes();
  }

}
