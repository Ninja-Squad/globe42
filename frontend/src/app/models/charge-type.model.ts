import { ChargeCategoryModel } from './charge-category.model';

export interface ChargeTypeModel {
  id: number;
  name: string;
  category: ChargeCategoryModel;
  maxMonthlyAmount: number;
}
