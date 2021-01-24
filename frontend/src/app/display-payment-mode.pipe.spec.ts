import { DisplayPaymentModePipe } from './display-payment-mode.pipe';
import { PaymentMode } from './models/membership.model';

describe('DisplayPaymentModePipe', () => {
  it('should translate payment mode', () => {
    const pipe = new DisplayPaymentModePipe();
    expect(pipe.transform('UNKNOWN')).toBe('Inconnu');
    expect(pipe.transform('CASH')).toBe('Espèces');
    expect(pipe.transform('CHECK')).toBe('Chèque');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('foobar' as PaymentMode)).toBe('???foobar???');
  });
});
