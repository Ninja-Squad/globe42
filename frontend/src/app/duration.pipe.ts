import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(minutes: number): string {
    return `${Math.trunc(minutes / 60)}h${this.leftPadZero(minutes % 60)}m`;
  }

  private leftPadZero(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
