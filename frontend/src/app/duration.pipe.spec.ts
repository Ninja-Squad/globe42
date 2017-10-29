import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  it('should format a duration in minutes', () => {
    const pipe = new DurationPipe();
    expect(pipe.transform(0)).toBe('0h00m');
    expect(pipe.transform(5)).toBe('0h05m');
    expect(pipe.transform(15)).toBe('0h15m');
    expect(pipe.transform(65)).toBe('1h05m');
    expect(pipe.transform(119)).toBe('1h59m');
  });
});
