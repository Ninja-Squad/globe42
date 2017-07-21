import { DisplayFiscalStatusPipe } from './display-fiscal-status.pipe';

describe('DisplayFiscalStatusPipe', () => {
  it('should translate fiscal statuses', () => {
    const pipe = new DisplayFiscalStatusPipe();
    expect(pipe.transform('TAXABLE')).toBe('Imposable');
    expect(pipe.transform('NOT_TAXABLE')).toBe('Non imposable');
  });
});
