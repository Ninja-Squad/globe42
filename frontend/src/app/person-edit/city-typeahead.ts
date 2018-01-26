import { SearchCityService } from '../search-city.service';
import { CityModel } from '../models/person.model';
import { Observable } from 'rxjs/Observable';
import { DisplayCityPipe } from '../display-city.pipe';
import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

export class CityTypeahead {

  searchFailed = false;
  searcher: (text$: Observable<string>) => Observable<Array<CityModel>>;
  formatter: (result: CityModel) => string;

  constructor(private searchCityService: SearchCityService, private displayCityPipe: DisplayCityPipe) {
    this.searcher = (text$: Observable<string>) =>
      text$.pipe(
        filter(query => query.length > 1),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term =>
          this.searchCityService.search(term).pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
        )
      );

    this.formatter = (result: CityModel) => this.displayCityPipe.transform(result);
  }
}
