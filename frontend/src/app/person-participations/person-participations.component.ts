import { Component } from '@angular/core';
import { ParticipationModel } from '../models/participation.model';
import { ParticipationService } from '../participation.service';
import { PersonModel } from '../models/person.model';
import { CurrentPersonService } from '../current-person.service';
import { ActivatedRoute } from '@angular/router';
import { ACTIVITY_TYPES, ActivityTypeModel } from '../models/activity-type.model';

export interface ParticipationItem {
  id: number;
  activityType: ActivityTypeModel;
  selected: boolean;
}

@Component({
  selector: 'gl-person-participations',
  templateUrl: './person-participations.component.html',
  styleUrls: ['./person-participations.component.scss']
})
export class PersonParticipationsComponent {
  items: Array<ParticipationItem>;
  person: PersonModel;

  constructor(
    currentPersonService: CurrentPersonService,
    route: ActivatedRoute,
    private participationService: ParticipationService
  ) {
    this.person = currentPersonService.snapshot;

    const participations: Array<ParticipationModel> = route.snapshot.data.participations;
    this.items = ACTIVITY_TYPES.map(activityType => {
      const participation = participations.find(p => p.activityType === activityType.key);
      return {
        id: participation?.id,
        activityType,
        selected: !!participation
      };
    });
  }

  selectItem(item: ParticipationItem) {
    item.selected = !item.selected;
    if (item.selected) {
      this.participationService.create(this.person.id, item.activityType.key).subscribe({
        next: participation => (item.id = participation.id),
        error: () => (item.selected = false)
      });
    } else {
      this.participationService.delete(this.person.id, item.id).subscribe({
        next: () => (item.id = null),
        error: () => (item.selected = true)
      });
    }
  }
}
