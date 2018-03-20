import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

/**
 * Base class used for typeahead helpers
 */
export abstract class ArrayBasedTypeahead<T> {
  searcher: (text$: Observable<string>) => Observable<Array<T>>;
  formatter: (result: T) => string;

  constructor(public readonly elements: Array<T>) {
    this.searcher = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term === '' ? [] : elements.filter(element => this.isAccepted(element, term)).slice(0, 10))
      );

    this.formatter = (result: T) => this.format(result);
  }

  protected abstract isAccepted(element: T, term: string): boolean;
  protected abstract format(element: T): string;
}
