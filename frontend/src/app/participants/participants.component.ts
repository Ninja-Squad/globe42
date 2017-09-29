import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonIdentityModel } from '../models/person.model';
import { sortBy } from '../utils';
import { FullnamePipe } from '../fullname.pipe';
import { ActivityType } from '../models/participation.model';

@Component({
  selector: 'gl-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

  participants: Array<PersonIdentityModel>;
  activityType: ActivityType;

  constructor(private route: ActivatedRoute, private fullnamePipe: FullnamePipe) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.participants = sortBy(data['participants'], p => this.fullnamePipe.transform(p));
    });
    this.route.paramMap.subscribe(paramMap => {
      this.activityType = paramMap.get('activityType') as ActivityType;
    });
  }
}
