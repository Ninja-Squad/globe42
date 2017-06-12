import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IncomeService } from './income.service';
import { IncomeTypeModel } from './models/income.model';

@Injectable()
export class IncomeTypeResolverService {

  constructor(private incomeService: IncomeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<IncomeTypeModel>> {
    const typeId = +route.paramMap.get('id');
    return this.incomeService.getType(typeId);
  }

}
