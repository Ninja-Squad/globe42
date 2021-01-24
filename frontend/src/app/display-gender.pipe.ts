import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { Gender } from './models/person.model';

const GENDER_TRANSLATIONS: Record<Gender, string> = {
  MALE: 'Homme',
  FEMALE: 'Femme',
  OTHER: 'Autre'
};

@Pipe({
  name: 'displayGender'
})
export class DisplayGenderPipe extends BaseEnumPipe<Gender> implements PipeTransform {
  constructor() {
    super(GENDER_TRANSLATIONS);
  }
}
