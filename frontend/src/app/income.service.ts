import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { IncomeSourceModel, IncomeSourceTypeModel } from './models/income.model';
import { IncomeSourceCommand } from './models/income-source.command';

@Injectable()
export class IncomeService {

  constructor(private http: HttpClient) { }

  listTypes(): Observable<Array<IncomeSourceTypeModel>> {
    return this.http.get('/api/income-source-types');
  }

  createType(incomeType: IncomeSourceTypeModel): Observable<IncomeSourceTypeModel> {
    return this.http.post('/api/income-source-types', incomeType);
  }

  getType(typeId: number): Observable<IncomeSourceTypeModel> {
    return this.http.get(`/api/income-source-types/${typeId}`);
  }

  updateType(incomeType: IncomeSourceTypeModel): Observable<void> {
    return this.http.put<void>(`/api/income-source-types/${incomeType.id}`, incomeType);
  }

  listSources(): Observable<Array<IncomeSourceModel>> {
    return this.http.get('/api/income-sources');
  }

  createSource(incomeSource: IncomeSourceCommand): Observable<IncomeSourceModel> {
    return this.http.post('/api/income-sources', incomeSource);
  }

  updateSource(id: number, incomeSource: IncomeSourceCommand): Observable<void> {
    return this.http.put<void>(`/api/income-sources/${id}`, incomeSource);
  }

  getSource(id: number): Observable<IncomeSourceModel> {
    return this.http.get(`/api/income-sources/${id}`);
  }
}
