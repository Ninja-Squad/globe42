import { sortBy, interpolate } from './utils';

describe('utils', () => {
  it('should sort by', () => {
    const array = [
      { foo: 'b' },
      { foo: 'a' },
      { foo: 'c' },
      { foo: 'a' },
      { foo: 'b' }
    ];

    const result = sortBy(array, o => o.foo);
    expect(result.map(o => o.foo)).toEqual(['a', 'a', 'b', 'b', 'c']);
    expect(result).not.toBe(array);
  });

  it('should interpolate', () => {
    const template = 'Hello ${w}, the ${w} is ${score}/${total} today';
    expect(interpolate(template, { w: 'world', score: 9, total: 10 })).toBe(
      'Hello world, the world is 9/10 today'
    );
  });
});
