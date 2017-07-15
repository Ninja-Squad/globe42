export interface IncomeSourceTypeModel {
  id: number;
  type: string;
}

export interface IncomeSourceModel {
  id: number;
  name: string;
  type: IncomeSourceTypeModel;
  maxMonthlyAmount: number;
}
