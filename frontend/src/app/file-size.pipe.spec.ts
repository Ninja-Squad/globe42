import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  it('should format', () => {
    const pipe = new FileSizePipe('fr-FR');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(0)).toBe('0\u202fo');
    expect(pipe.transform(999)).toBe('999\u202fo');
    expect(pipe.transform(1000)).toBe('1\u202fKo');
    expect(pipe.transform(1501)).toBe('1,5\u202fKo');
    expect(pipe.transform(1000000)).toBe('1\u202fMo');
    expect(pipe.transform(1500000)).toBe('1,5\u202fMo');
    expect(pipe.transform(1000000000)).toBe('1\u202fGo');
    expect(pipe.transform(1000000000000)).toBe('1\u202f000\u202fGo');
  });
});
