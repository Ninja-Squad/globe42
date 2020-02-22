import { PersonIdentityModel } from '../models/person.model';
import { displayFullname } from '../fullname.pipe';
import { sortBy } from '../utils';
import { ArrayBasedTypeahead } from '../globe-ngb/array-based-typeahead';

/**
 * Class used to help implementing a person typeahead
 */
export class PersonTypeahead extends ArrayBasedTypeahead<PersonIdentityModel> {

  constructor(persons: Array<PersonIdentityModel>) {
    super(sortBy(persons, displayFullname));
  }

  protected isAccepted(person: PersonIdentityModel, term: string): boolean {
    const s = term.toLowerCase();
    return person.firstName.toLowerCase().includes(s)
      || person.lastName.toLowerCase().includes(s)
      || person.nickName?.toLowerCase().includes(s)
      || person.mediationCode?.toLowerCase().includes(s);
  }

  protected format(element: PersonIdentityModel): string {
    return displayFullname(element);
  }
}
