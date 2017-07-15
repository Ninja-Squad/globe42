import { DisplayMaritalStatusPipe } from './display-marital-status.pipe';

describe('DisplayMaritalStatusPipe', () => {
  it('should translate marital status', () => {
    const pipe = new DisplayMaritalStatusPipe();
    expect(pipe.transform('MARRIED')).toBe('Marié(e)');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('foobar')).toBe('???foobar???');
  });
});
