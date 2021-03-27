import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceTypeService } from './income-source-type.service';

@Injectable({ providedIn: 'root' })
export class IncomeTypesResolverService implements Resolve<Array<IncomeSourceTypeModel>> {
  constructor(private incomeService: IncomeSourceTypeService) {}

  resolve(): Observable<Array<IncomeSourceTypeModel>> {
    return this.incomeService.list();
  }
}
