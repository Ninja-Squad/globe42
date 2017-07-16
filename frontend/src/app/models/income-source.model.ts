import { IncomeSourceTypeModel } from './income-source-type.model';

export interface IncomeSourceModel {
  id: number;
  name: string;
  type: IncomeSourceTypeModel;
  maxMonthlyAmount: number;
}
