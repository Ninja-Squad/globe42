import { ArrayBasedTypeahead } from '../globe-ngb/array-based-typeahead';
import { CountryModel } from '../models/country.model';

/**
 * Class used to help implementing a country typeahead
 */
export class CountryTypeahead extends ArrayBasedTypeahead<CountryModel> {
  constructor(countries: Array<CountryModel>) {
    super(countries);
  }

  protected isAccepted(country: CountryModel, term: string): boolean {
    const s = term.toLowerCase();
    return country.name.toLowerCase().includes(s);
  }

  protected format(element: CountryModel): string {
    return element.name;
  }
}
