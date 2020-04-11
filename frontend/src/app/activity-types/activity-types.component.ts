import { Component } from '@angular/core';
import { ActivityType } from '../models/participation.model';
import { ACTIVITY_TYPE_TRANSLATIONS } from '../display-activity-type.pipe';

@Component({
  selector: 'gl-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.scss']
})
export class ActivityTypesComponent {
  activityTypes: Array<ActivityType> = ACTIVITY_TYPE_TRANSLATIONS.map(t => t.key);
}
