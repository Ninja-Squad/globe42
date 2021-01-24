import { DisplayMaritalStatusPipe } from './display-marital-status.pipe';
import { MaritalStatus } from './models/person.model';

describe('DisplayMaritalStatusPipe', () => {
  it('should translate marital status', () => {
    const pipe = new DisplayMaritalStatusPipe();
    expect(pipe.transform('MARRIED')).toBe('Marié(e)');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('foobar' as MaritalStatus)).toBe('???foobar???');
  });
});
