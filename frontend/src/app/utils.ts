export function sortBy<T>(array: Array<T>, extractor: (T) => any) {
  array.sort((e1, e2) => {
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
}
