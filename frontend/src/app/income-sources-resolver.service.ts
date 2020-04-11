import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IncomeSourceModel } from './models/income-source.model';
import { IncomeSourceService } from './income-source.service';

@Injectable({ providedIn: 'root' })
export class IncomeSourcesResolverService implements Resolve<Array<IncomeSourceModel>> {
  constructor(private incomeService: IncomeSourceService) {}

  resolve(): Observable<Array<IncomeSourceModel>> {
    return this.incomeService.list();
  }
}
