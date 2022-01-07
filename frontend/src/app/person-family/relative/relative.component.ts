import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RelativeModel } from '../../models/family.model';
import { DateTime } from 'luxon';

@Component({
  selector: 'gl-relative',
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelativeComponent {
  @Input() relative: RelativeModel;

  get age(): number {
    return -DateTime.fromISO(this.relative.birthDate).diffNow('years').years;
  }
}
