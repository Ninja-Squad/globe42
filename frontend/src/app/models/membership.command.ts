import { PaymentMode } from './membership.model';

export interface MembershipCommand {
  year: number;
  paymentMode: Exclude<PaymentMode, 'UNKNOWN'>;
  paymentDate: string;
  cardNumber: number | null;
}
