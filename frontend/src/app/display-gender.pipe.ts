import { Pipe } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';

export const GENDER_TRANSLATIONS = [
  {key: 'male', translation: 'Homme'},
  {key: 'female', translation: 'Femme'},
  {key: 'other', translation: 'Autre'}
];

@Pipe({
  name: 'displayGender'
})
export class DisplayGenderPipe extends BaseEnumPipe {

  constructor() {
    super(GENDER_TRANSLATIONS);
  }

}
