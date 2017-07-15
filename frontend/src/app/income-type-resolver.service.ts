import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IncomeService } from './income.service';
import { IncomeSourceTypeModel } from './models/income.model';

@Injectable()
export class IncomeTypeResolverService implements Resolve<IncomeSourceTypeModel> {

  constructor(private incomeService: IncomeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IncomeSourceTypeModel> {
    const typeId = +route.paramMap.get('id');
    return this.incomeService.getType(typeId);
  }

}
