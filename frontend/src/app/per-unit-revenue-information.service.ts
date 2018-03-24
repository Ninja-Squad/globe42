import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PerUnitRevenueInformationModel } from './models/per-unit-revenue-information.model';
import { Observable } from 'rxjs';

function buildUrl(personId: number) {
  return `/api/persons/${personId}/per-unit-revenue`;
}

@Injectable({ providedIn: 'root' })
export class PerUnitRevenueInformationService {

  constructor(private http: HttpClient) {
  }

  get(personId: number): Observable<PerUnitRevenueInformationModel | null> {
    return this.http.get<PerUnitRevenueInformationModel | null>(buildUrl(personId));
  }

  delete(personId: number): Observable<void> {
    return this.http.delete<void>(buildUrl(personId));
  }

  update(personId: number, info: PerUnitRevenueInformationModel): Observable<void> {
    return this.http.put<void>(buildUrl(personId), info);
  }
}
