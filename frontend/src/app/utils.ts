import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export class Comparator<T> {
  constructor(private fn: (a: T, b: T) => number) {}

  static comparing<T>(extractor: (t: T) => any): Comparator<T> {
    const fn = (a: T, b: T) => {
      const v1 = extractor(a);
      const v2 = extractor(b);
      let r = 0;
      if (v1 < v2) {
        r = -1;
      }
      if (v1 > v2) {
        r = 1;
      }
      return r;
    };
    return new Comparator(fn);
  }

  thenComparing(comparatorOrExtractor: Comparator<T> | ((t: T) => any)): Comparator<T> {
    const otherComparator: Comparator<T> =
      (comparatorOrExtractor instanceof Comparator) ? comparatorOrExtractor : Comparator.comparing<T>(comparatorOrExtractor);
    const fn = (a: T, b: T) => {
      const r = this.fn(a, b);
      if (r === 0) {
        return otherComparator.fn(a, b);
      }
      return r;
    };
    return new Comparator<T>(fn);
  }

  reversed(): Comparator<T> {
    return new Comparator<T>((a, b) => -this.fn(a, b));
  }

  sort(array: Array<T>): void {
    array.sort(this.fn);
  }
}

export function sortBy<T>(array: Array<T>, comparatorOrExtractor: Comparator<T> | ((t: T) => any)): Array<T> {
  const result = array.slice();
  const comparator: Comparator<T> =
    (comparatorOrExtractor instanceof Comparator) ? comparatorOrExtractor : Comparator.comparing(comparatorOrExtractor);
  comparator.sort(result);
  return result;
}

/**
 * Takes a string containing placeholders such as ${foo}, and replaces them by their value in the given
 * parameters. Beware: no expression supported, no space in curly braces.
 *
 * So interpolate('hello ${name}', { name: 'JB' }) returns "hello JB".
 *
 * This function is only used (currently) to generate functional error messages from code and parameters
 * coming from the backend.
 */
export function interpolate(template: string, parameters: {[key: string]: any}): string {
  // ugly loop because JS doesn't have a Regexp.quote() method, nor a replaceAll method. replace is supposed to replace
  // all, but it does not.
  let result = template;
  Object.keys(parameters).forEach(key => {
    const searchValue = '${' + key + '}';
    const replaceValue = `${parameters[key]}`;
    do {
      result = result.replace(searchValue, replaceValue);
    }
    while (result.indexOf(searchValue) >= 0);
  });
  return result;
}

/**
 * Takes an NgbDateStruct and transforms it to an ISO date string (yyyy-MM-dd). If the given date is falsy,
 * returns null.
 */
export function dateToIso(date: NgbDateStruct): string {
  return date ? `${date.year}-${padNumber(date.month)}-${padNumber(date.day)}` : null;
}

/**
 * Takes an ISO date string (yyyy-MM-dd) and transforms it into an NgbDateStruct. If the given value is falsy,
 * returns null.
 */
export function isoToDate(value: string): NgbDateStruct {
  if (value) {
    const dateParts = value.trim().split('-');
    return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2])};
  }
  return null;
}

/**
 * Takes a number of minutes and transforms it to a duration string of the for 'HhMMm'
 */
export function minutesToDuration(minutes: number) {
  return `${Math.trunc(minutes / 60)}h${leftPadZero(minutes % 60)}m`;
}

function leftPadZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
