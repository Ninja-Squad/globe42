/**
 * Class used to help implementing a person typeahead
 */
import { PersonIdentityModel } from '../models/person.model';
import { Observable } from 'rxjs/Observable';
import { FullnamePipe } from '../fullname.pipe';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

export class PersonTypeahead {

  formatter = (result: PersonIdentityModel) => this.fullnamePipe.transform(result);

  searcher = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? [] : this.persons.filter(person => this.isPersonAccepted(person, term)).slice(0, 10));

  constructor(public persons: Array<PersonIdentityModel>,
              private fullnamePipe: FullnamePipe) {}


  private isPersonAccepted(person: PersonIdentityModel, term: string): boolean {
    const s = term.toLowerCase();
    return person.firstName.toLowerCase().includes(s)
      || person.lastName.toLowerCase().includes(s)
      || (person.nickName && person.nickName.toLowerCase().includes(s))
      || (person.mediationCode && person.mediationCode.toLowerCase().includes(s));
  }
}
