import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IncomeService } from './income.service';
import { IncomeSourceModel } from './models/income.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IncomeSourceResolverService implements Resolve<IncomeSourceModel> {

  constructor(private incomeService: IncomeService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IncomeSourceModel> {
    return this.incomeService.getSource(+route.paramMap.get('id'));
  }
}
