import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeModel } from './models/income.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IncomeService {

  constructor(private http: HttpClient) { }

  list(personId: number): Observable<Array<IncomeModel>> {
    return this.http.get(`/api/persons/${personId}/incomes`);
  }

  delete(personId: number, incomeId: number): Observable<void> {
    return this.http.delete<void>(`/api/persons/${personId}/incomes/${incomeId}`);
  }
}
