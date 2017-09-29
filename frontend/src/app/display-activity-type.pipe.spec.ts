import { DisplayActivityTypePipe } from './display-activity-type.pipe';

describe('DisplayActivityTypePipe', () => {
  it('should translate activity type', () => {
    const pipe = new DisplayActivityTypePipe();
    expect(pipe.transform('MEAL')).toBe('Repas');
  });
});
