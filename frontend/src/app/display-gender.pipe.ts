import { Pipe } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { Gender } from './models/person.model';

export const GENDER_TRANSLATIONS: Array<{ key: Gender; translation: string; }> = [
  {key: 'MALE', translation: 'Homme'},
  {key: 'FEMALE', translation: 'Femme'},
  {key: 'OTHER', translation: 'Autre'}
];

@Pipe({
  name: 'displayGender'
})
export class DisplayGenderPipe extends BaseEnumPipe {

  constructor() {
    super(GENDER_TRANSLATIONS);
  }

}
