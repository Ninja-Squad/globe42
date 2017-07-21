import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FamilySituation } from '../models/person.model';

@Component({
  selector: 'gl-family-situation',
  templateUrl: './family-situation.component.html',
  styleUrls: ['./family-situation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilySituationComponent {

  @Input()
  situation: FamilySituation;
}
