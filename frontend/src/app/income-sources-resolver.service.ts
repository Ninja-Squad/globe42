import { Injectable } from '@angular/core';
import { IncomeService } from './income.service';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IncomeSourceModel } from './models/income.model';

@Injectable()
export class IncomeSourcesResolverService implements Resolve<Array<IncomeSourceModel>> {

  constructor(private incomeService: IncomeService) { }

  resolve(): Observable<Array<IncomeSourceModel>> {
    return this.incomeService.listSources();
  }
}
