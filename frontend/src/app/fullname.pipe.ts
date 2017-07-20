import { Pipe, PipeTransform } from '@angular/core';
import { PersonModel } from './models/person.model';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(person: PersonModel): string {
    const elements = [person.firstName, person.lastName, person.nickName ? `(${person.nickName})` : null];
    return elements.filter(e => e).join(' ');
  }
}
