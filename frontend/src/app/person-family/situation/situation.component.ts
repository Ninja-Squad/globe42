import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Situation } from '../person-family.component';

@Component({
  selector: 'gl-situation',
  templateUrl: './situation.component.html',
  styleUrls: ['./situation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SituationComponent {
  @Input()
  situation: Situation;
}
