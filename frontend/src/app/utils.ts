/**
 * Creates a sorted copy of an array, by extracting a value from each element using the given extractor,
 * and comparing the values.
 *
 * Usages of this method could be replaced by Lodash's sortBy method
 */
export function sortBy<T>(array: Array<T>, extractor: (T) => any): Array<T> {
  const result = array.slice();
  result.sort((e1, e2) => {
    const v1 = extractor(e1);
    const v2 = extractor(e2);
    if (v1 < v2) {
      return -1;
    }
    if (v1 > v2) {
      return 1;
    }
    return 0;
  });
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
    while (result.indexOf(searchValue) >= 0)
  });
  return result;
}
