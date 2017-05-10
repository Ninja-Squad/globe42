import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayGender'
})
export class DisplayGenderPipe implements PipeTransform {

  transform(value: 'male' | 'female' | 'other', args?: any): any {
    switch (value) {
      case 'male':
        return 'Homme';
      case 'female':
        return 'Femme';
      case 'other':
        return 'Autre';
    }
  }

}
