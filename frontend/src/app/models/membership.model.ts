export type PaymentMode = 'CASH' | 'CHECK' | 'UNKNOWN';

export interface MembershipModel {
  id: number;
  year: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  cardNumber: string | null;
}
