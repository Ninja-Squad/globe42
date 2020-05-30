import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HealthCareCoverageModel } from './models/health-care-coverage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthCareCoverageService {
  constructor(private http: HttpClient) {}

  get(): Observable<HealthCareCoverageModel> {
    return this.http.get<HealthCareCoverageModel>('/api/health-care-coverage');
  }
}
