import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { sortBy } from '../utils';
import { ActivityType } from '../models/participation.model';
import { ParticipantModel } from '../models/participant.model';
import { displayFullname } from '../fullname.pipe';

@Component({
  selector: 'gl-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  participants: Array<ParticipantModel>;
  activityType: ActivityType;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.participants = sortBy<ParticipantModel>(data.participants, displayFullname);
    });
    this.route.paramMap.subscribe(paramMap => {
      this.activityType = paramMap.get('activityType') as ActivityType;
    });
  }
}
