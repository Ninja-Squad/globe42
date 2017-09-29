import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  it('should format', () => {
    const pipe = new FileSizePipe('fr-FR');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(0)).toBe('0\u00a0o');
    expect(pipe.transform(999)).toBe('999\u00a0o');
    expect(pipe.transform(1000)).toBe('1\u00a0Ko');
    expect(pipe.transform(1501)).toBe('1,5\u00a0Ko');
    expect(pipe.transform(1000000)).toBe('1\u00a0Mo');
    expect(pipe.transform(1500000)).toBe('1,5\u00a0Mo');
    expect(pipe.transform(1000000000)).toBe('1\u00a0Go');
    expect(pipe.transform(1000000000000)).toBe('1\u00a0000\u00a0Go');
  });
});
