import { SearchCityService } from '../search-city.service';
import { CityModel } from '../models/person.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { DisplayCityPipe } from '../display-city.pipe';

export class CityTypeahead {

  searchFailed = false;

  searcher = (text$: Observable<string>) =>
    text$
      .filter(query => query.length > 1)
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term =>
        this.searchCityService.search(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }));

  formatter = (result: CityModel) => this.displayCityPipe.transform(result);

  constructor(private searchCityService: SearchCityService, private displayCityPipe: DisplayCityPipe) {}
}
