import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityType, ParticipationModel } from '../models/participation.model';
import { ACTIVITY_TYPE_TRANSLATIONS } from '../display-activity-type.pipe';
import { ParticipationService } from '../participation.service';
import { PersonModel } from '../models/person.model';

export interface ParticipationItem {
  id: number;
  activityType: ActivityType;
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

  constructor(route: ActivatedRoute, private participationService: ParticipationService) {
    this.person = route.parent.snapshot.data['person'];

    const participations: Array<ParticipationModel> = route.snapshot.data['participations'];
    this.items = ACTIVITY_TYPE_TRANSLATIONS.map(t => {
      const participation = participations.filter(p => p.activityType === t.key)[0];
      return {
        id: participation && participation.id,
        activityType: t.key,
        selected: !!participation
      };
    });
  }

  selectionChanged(item: ParticipationItem) {
    if (item.selected) {
      this.participationService.create(this.person.id, item.activityType)
        .subscribe(participation => {
          item.id = participation.id;
        }, () => {
          item.selected = false;
        });
    } else {
      this.participationService.delete(this.person.id, item.id)
        .subscribe(() => {
          item.id = null;
        }, () => {
          item.selected = true;
        });
    }
  }
}
