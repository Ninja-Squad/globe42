import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { IncomeTypeModel } from './models/income.model';

@Injectable()
export class IncomeService {

  constructor(private http: HttpClient) { }

  listTypes(): Observable<Array<IncomeTypeModel>> {
    return this.http.get('/api/income-source-types');
  }

  createType(incomeType: IncomeTypeModel) {
    return this.http.post('/api/income-source-types', incomeType);
  }

  getType(typeId: number) {
    return this.http.get(`/api/income-source-types/${typeId}`);
  }

  updateType(incomeType: IncomeTypeModel) {
    return this.http.put(`/api/income-source-types/${incomeType.id}`, incomeType);
  }
}
