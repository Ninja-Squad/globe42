import { sortBy } from './utils';

describe('utils', () => {
  it('should sort by', () => {
    const array = [
      { foo: 'b' },
      { foo: 'a' },
      { foo: 'c' },
      { foo: 'a' },
      { foo: 'b' }
    ];

    sortBy(array, o => o.foo);
    expect(array.map(o => o.foo)).toEqual(['a', 'a', 'b', 'b', 'c']);
  });
});
