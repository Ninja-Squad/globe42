import { DisplayVisaPipe } from './display-visa.pipe';

describe('DisplayVisaPipe', () => {
  it('should display a visa', () => {
    const pipe = new DisplayVisaPipe();
    expect(pipe.transform('NONE')).toBe('Aucun');
    expect(pipe.transform('SHORT_STAY')).toBe('C (court séjour)');
  });
});
