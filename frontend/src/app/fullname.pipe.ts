import { Pipe, PipeTransform } from '@angular/core';
import { PersonIdentityModel } from './models/person.model';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(person: PersonIdentityModel): string {
    const elements = [person.firstName, person.lastName, person.nickName ? `(${person.nickName})` : null];
    return elements.filter(e => e).join(' ');
  }
}
