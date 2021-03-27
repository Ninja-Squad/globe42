import { Pipe, PipeTransform } from '@angular/core';
import { CityModel } from './models/person.model';

export function displayCity(city: CityModel) {
  return `${city.code} ${city.city}`;
}

@Pipe({
  name: 'displayCity'
})
export class DisplayCityPipe implements PipeTransform {
  transform(city: CityModel): string {
    return city ? displayCity(city) : '';
  }
}
