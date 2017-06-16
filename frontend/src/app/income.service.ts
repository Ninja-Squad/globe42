import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { IncomeTypeModel } from './models/income.model';

@Injectable()
export class IncomeService {

  constructor(private http: Http) { }

  listTypes(): Observable<Array<IncomeTypeModel>> {
    return this.http.get('/api/income-source-types').map(response => response.json());
  }

  createType(incomeType: IncomeTypeModel) {
    return this.http.post('/api/income-source-types', incomeType).map(response => response.json());
  }

  getType(typeId: number) {
    return this.http.get(`/api/income-source-types/${typeId}`).map(response => response.json());
  }

  updateType(incomeType: IncomeTypeModel) {
    return this.http.put(`/api/income-source-types/${incomeType.id}`, incomeType).map(response => response.json());
  }
}
