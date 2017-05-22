import { Pipe, PipeTransform } from '@angular/core';
import { CityModel } from './models/user.model';

@Pipe({
  name: 'displayCity'
})
export class DisplayCityPipe implements PipeTransform {

  transform(city: CityModel, args?: any): any {
    return city && city.code && city.city ? `${city.code} ${city.city}`.trim() : '';
  }

}
