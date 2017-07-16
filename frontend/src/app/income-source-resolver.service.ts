import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IncomeSourceModel } from './models/income-source.model';
import { IncomeSourceService } from './income-source.service';

@Injectable()
export class IncomeSourceResolverService implements Resolve<IncomeSourceModel> {

  constructor(private incomeService: IncomeSourceService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IncomeSourceModel> {
    return this.incomeService.get(+route.paramMap.get('id'));
  }
}
