import { Pipe, PipeTransform } from '@angular/core';
import { PersonIdentityModel } from './models/person.model';

export function displayFullname(person: PersonIdentityModel) {
  const elements = [person.firstName, person.lastName, person.nickName ? `(${person.nickName})` : null];
  return elements.filter(e => e).join(' ');
}

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(person: PersonIdentityModel): string {
    return displayFullname(person);
  }
}
