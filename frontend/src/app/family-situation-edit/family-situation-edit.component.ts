import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'gl-family-situation-edit',
  templateUrl: './family-situation-edit.component.html',
  styleUrls: ['./family-situation-edit.component.scss']
})
export class FamilySituationEditComponent {

  @Input()
  situation: FormGroup;

  @Input()
  location: string;
}
