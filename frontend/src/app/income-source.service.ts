import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { IncomeSourceCommand } from './models/income-source.command';
import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceModel } from './models/income-source.model';
import { IncomeSourceTypeCommand } from './models/income-source-type.command';

@Injectable()
export class IncomeSourceService {

  constructor(private http: HttpClient) { }

  list(): Observable<Array<IncomeSourceModel>> {
    return this.http.get<Array<IncomeSourceModel>>('/api/income-sources');
  }

  create(incomeSource: IncomeSourceCommand): Observable<IncomeSourceModel> {
    return this.http.post<IncomeSourceModel>('/api/income-sources', incomeSource);
  }

  update(id: number, incomeSource: IncomeSourceCommand): Observable<void> {
    return this.http.put<void>(`/api/income-sources/${id}`, incomeSource);
  }

  get(id: number): Observable<IncomeSourceModel> {
    return this.http.get<IncomeSourceModel>(`/api/income-sources/${id}`);
  }
}
