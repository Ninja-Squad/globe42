import { DisplayPassportStatusPipe } from './display-passport-status.pipe';

describe('DisplayPassportStatusPipe', () => {
  it('should display a passport status', () => {
    const pipe = new DisplayPassportStatusPipe();
    expect(pipe.transform('UNKNOWN')).toBe('Inconnu');
    expect(pipe.transform('PASSPORT')).toBe('Oui');
    expect(pipe.transform('NO_PASSPORT')).toBe('Non');
  });
});
