import { HealthCareCoverage } from './person.model';

export interface HealthCareCoverageEntryModel {
  coverage: HealthCareCoverage;
  count: number;
}

export interface HealthCareCoverageModel {
  entries: Array<HealthCareCoverageEntryModel>;
}
