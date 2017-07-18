import { IncomeSourceModel } from './income-source.model';

export interface IncomeModel {
  id: number;
  source: IncomeSourceModel;
  monthlyAmount: number;
}
