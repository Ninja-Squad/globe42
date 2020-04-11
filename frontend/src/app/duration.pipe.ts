import { Pipe, PipeTransform } from '@angular/core';
import { minutesToDuration } from './utils';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    return minutesToDuration(minutes);
  }
}
