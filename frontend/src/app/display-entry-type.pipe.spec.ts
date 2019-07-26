import { DisplayEntryTypePipe } from './display-entry-type.pipe';

describe('DisplayEntryTypePipe', () => {
  it('should translate entry types', () => {
    const pipe = new DisplayEntryTypePipe();
    expect(pipe.transform('UNKNOWN')).toBe('Inconnue');
    expect(pipe.transform('REGULAR')).toBe('Régulière');
    expect(pipe.transform('IRREGULAR')).toBe('Irrégulière');
  });
});
