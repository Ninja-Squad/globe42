import { DisplayWeddingEventTypePipe } from './display-wedding-event-type.pipe';

describe('DisplayWeddingEventTypePipe', () => {
  it('should translate wedding event type', () => {
    const pipe = new DisplayWeddingEventTypePipe();
    expect(pipe.transform('WEDDING')).toBe('Mariage');
    expect(pipe.transform('DIVORCE')).toBe('Divorce');
  });
});
