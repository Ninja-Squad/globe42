import { Comparator, dateToIso, interpolate, isoToDate, sortBy } from './utils';

describe('utils', () => {
  it('should sort by', () => {
    const array = [{ foo: 'b' }, { foo: 'a' }, { foo: 'c' }, { foo: 'a' }, { foo: 'b' }];

    const result = sortBy(array, o => o.foo);
    expect(result.map(o => o.foo)).toEqual(['a', 'a', 'b', 'b', 'c']);
    expect(result).not.toBe(array);
  });

  it('should sort by in reverse', () => {
    const array = [{ foo: 'b' }, { foo: 'a' }, { foo: 'c' }, { foo: 'a' }, { foo: 'b' }];

    const result = sortBy(array, Comparator.comparing<{ foo: string }>(o => o.foo).reversed());
    expect(result.map(o => o.foo)).toEqual(['c', 'b', 'b', 'a', 'a']);
    expect(result).not.toBe(array);
  });

  it('should compare then compare by a second function', () => {
    const array = [
      { foo: 'b', bar: 1 },
      { foo: 'a', bar: 1 },
      { foo: 'c', bar: 1 },
      { foo: 'a', bar: 0 },
      { foo: 'b', bar: 0 }
    ];

    const result = sortBy(
      array,
      Comparator.comparing<{ foo: string; bar: number }>(o => o.foo).thenComparing(o => o.bar)
    );
    expect(result).toEqual([
      { foo: 'a', bar: 0 },
      { foo: 'a', bar: 1 },
      { foo: 'b', bar: 0 },
      { foo: 'b', bar: 1 },
      { foo: 'c', bar: 1 }
    ]);
  });

  it('should compare then compare by a second comparator', () => {
    const array = [
      { foo: 'b', bar: 1 },
      { foo: 'a', bar: 1 },
      { foo: 'c', bar: 1 },
      { foo: 'a', bar: 0 },
      { foo: 'b', bar: 0 }
    ];

    const result = sortBy(
      array,
      Comparator.comparing<{ foo: string; bar: number }>(o => o.foo).thenComparing(
        Comparator.comparing<{ foo: string; bar: number }>(o => o.bar).reversed()
      )
    );
    expect(result).toEqual([
      { foo: 'a', bar: 1 },
      { foo: 'a', bar: 0 },
      { foo: 'b', bar: 1 },
      { foo: 'b', bar: 0 },
      { foo: 'c', bar: 1 }
    ]);
  });

  it('should interpolate', () => {
    const template = 'Hello ${w}, the ${w} is ${score}/${total} today';
    expect(interpolate(template, { w: 'world', score: 9, total: 10 })).toBe(
      'Hello world, the world is 9/10 today'
    );
  });

  it('should transform an NgbDateStruct to an ISO string', () => {
    expect(dateToIso(null)).toBeNull();
    expect(dateToIso({ year: 2012, month: 11, day: 23 })).toBe('2012-11-23');
    expect(dateToIso({ year: 2012, month: 5, day: 2 })).toBe('2012-05-02');
  });

  it('should transform an ISO string to an NgbDateStruct', () => {
    expect(isoToDate(null)).toBeNull();
    expect(isoToDate('2012-11-23')).toEqual({ year: 2012, month: 11, day: 23 });
    expect(isoToDate('2012-05-02')).toEqual({ year: 2012, month: 5, day: 2 });
  });
});
