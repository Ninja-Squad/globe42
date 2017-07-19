import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeModel } from './models/income.model';
import { Observable } from 'rxjs/Observable';
import { IncomeCommand } from './models/income.command';

@Injectable()
export class IncomeService {

  constructor(private http: HttpClient) { }

  list(personId: number): Observable<Array<IncomeModel>> {
    return this.http.get(`/api/persons/${personId}/incomes`);
  }

  delete(personId: number, incomeId: number): Observable<void> {
    return this.http.delete<void>(`/api/persons/${personId}/incomes/${incomeId}`);
  }

  create(personId: number, command: IncomeCommand): Observable<IncomeModel> {
    return this.http.post(`/api/persons/${personId}/incomes`, command);
  }
}
