import { PersonIdentityModel } from '../models/person.model';
import { FullnamePipe } from '../fullname.pipe';
import { sortBy } from '../utils';
import { ArrayBasedTypeahead } from '../globe-ngb/array-based-typeahead';

/**
 * Class used to help implementing a person typeahead
 */
export class PersonTypeahead extends ArrayBasedTypeahead<PersonIdentityModel> {

  constructor(persons: Array<PersonIdentityModel>,
              private fullnamePipe: FullnamePipe) {
    super(sortBy(persons, p => fullnamePipe.transform(p)));
  }

  protected isAccepted(person: PersonIdentityModel, term: string): boolean {
    const s = term.toLowerCase();
    return person.firstName.toLowerCase().includes(s)
      || person.lastName.toLowerCase().includes(s)
      || (person.nickName && person.nickName.toLowerCase().includes(s))
      || (person.mediationCode && person.mediationCode.toLowerCase().includes(s));
  }

  protected format(element: PersonIdentityModel): string {
    return this.fullnamePipe.transform(element);
  }
}
