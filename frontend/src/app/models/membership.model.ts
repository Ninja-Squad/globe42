export const PAYMENT_MODES = ['CHECK', 'CASH', 'FREE', 'OUT_OF_DATE', 'UNKNOWN'] as const;
export type PaymentMode = typeof PAYMENT_MODES[number];

export interface MembershipModel {
  id: number;
  year: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  cardNumber: number | null;
}
