import { DisplayHousingPipe } from './display-housing.pipe';

describe('DisplayHousingPipe', () => {
  it('should transform housing', () => {
    const pipe = new DisplayHousingPipe();
    expect(pipe.transform('UNKNOWN')).toBe('Inconnu');
    expect(pipe.transform('F0')).toBe('F0');
    expect(pipe.transform('F6')).toBe('F6 ou plus');
  });
});
