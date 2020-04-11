import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Situation } from '../person-family.component';
import { ChildModel } from '../../models/family.model';
import { DateTime } from 'luxon';

@Component({
  selector: 'gl-situation',
  templateUrl: './situation.component.html',
  styleUrls: ['./situation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SituationComponent {
  @Input()
  situation: Situation;

  age(child: ChildModel): number {
    return -DateTime.fromISO(child.birthDate).diffNow('year').years;
  }
}
