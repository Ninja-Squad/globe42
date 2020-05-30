import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HealthCareCoverageModel } from './models/health-care-coverage.model';
import { HealthCareCoverageService } from './health-care-coverage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthCareCoverageResolverService implements Resolve<HealthCareCoverageModel> {
  constructor(private service: HealthCareCoverageService) {}

  resolve(): Observable<HealthCareCoverageModel> {
    return this.service.get();
  }
}
