export type PaymentMode = 'CASH' | 'CHECK' | 'FREE' | 'OUT_OF_DATE' | 'UNKNOWN';

export interface MembershipModel {
  id: number;
  year: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  cardNumber: string | null;
}
