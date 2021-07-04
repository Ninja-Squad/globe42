import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediationReportModel } from './mediation-statistics.model';

@Injectable({
  providedIn: 'root'
})
export class MediationStatisticsService {
  constructor(private http: HttpClient) {}

  get(from: string, to: string): Observable<MediationReportModel> {
    return this.http.get<MediationReportModel>('/api/mediation-statistics', {
      params: { from, to }
    });
  }
}
