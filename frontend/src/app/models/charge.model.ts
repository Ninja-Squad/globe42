import { ChargeTypeModel } from './charge-type.model';

export interface ChargeModel {
  id: number;
  type: ChargeTypeModel;
  monthlyAmount: number;
}
