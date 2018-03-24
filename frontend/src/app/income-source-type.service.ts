import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomeSourceTypeModel } from './models/income-source-type.model';
import { IncomeSourceTypeCommand } from './models/income-source-type.command';

@Injectable({ providedIn: 'root' })
export class IncomeSourceTypeService {

  constructor(private http: HttpClient) { }

  list(): Observable<Array<IncomeSourceTypeModel>> {
    return this.http.get<Array<IncomeSourceTypeModel>>('/api/income-source-types');
  }

  create(incomeType: IncomeSourceTypeCommand): Observable<IncomeSourceTypeModel> {
    return this.http.post<IncomeSourceTypeModel>('/api/income-source-types', incomeType);
  }

  get(typeId: number): Observable<IncomeSourceTypeModel> {
    return this.http.get<IncomeSourceTypeModel>(`/api/income-source-types/${typeId}`);
  }

  update(id: number, incomeType: IncomeSourceTypeCommand): Observable<void> {
    return this.http.put<void>(`/api/income-source-types/${id}`, incomeType);
  }
}
