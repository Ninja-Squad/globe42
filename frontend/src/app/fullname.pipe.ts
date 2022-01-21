import { Pipe, PipeTransform } from '@angular/core';
import { PersonIdentityModel } from './models/person.model';

export type FullnameOption = 'startWithFirstName' | 'startWithLastNameUppercase';

export function displayFullname(
  person: PersonIdentityModel,
  startWith: FullnameOption = 'startWithFirstName'
) {
  const elements = [
    startWith === 'startWithLastNameUppercase' ? person.lastName?.toUpperCase() : person.firstName,
    startWith === 'startWithLastNameUppercase' ? person.firstName : person.lastName,
    person.nickName ? `(${person.nickName})` : null
  ];
  return elements.filter(e => e).join(' ');
}

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {
  transform(person: PersonIdentityModel, startWith: FullnameOption = 'startWithFirstName'): string {
    return displayFullname(person, startWith);
  }
}
