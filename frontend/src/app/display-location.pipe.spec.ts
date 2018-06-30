import { DisplayLocationPipe } from './display-location.pipe';

describe('DisplayLocationPipe', () => {
  it('should translate locations', () => {
    const pipe = new DisplayLocationPipe();
    expect(pipe.transform('FRANCE')).toBe('en France');
    expect(pipe.transform('ABROAD')).toBe('au Pays');
  });
});
