export type PaymentMode = 'CASH' | 'CHECK' | 'UNKNOWN';

export interface MembershipCommand {
  year: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  cardNumber: string | null;
}
