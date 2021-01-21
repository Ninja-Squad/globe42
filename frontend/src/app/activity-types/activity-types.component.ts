import { Component } from '@angular/core';
import { ACTIVITY_TYPES } from '../models/activity-type.model';

@Component({
  selector: 'gl-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.scss']
})
export class ActivityTypesComponent {
  activityTypes = ACTIVITY_TYPES;
}
