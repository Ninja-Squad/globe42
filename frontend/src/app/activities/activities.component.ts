import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from '../models/activity.model';
import { Page } from '../models/page';

@Component({
  selector: 'gl-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  activities: Page<Activity>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => (this.activities = data.activities));
  }

  loadPage(event: number) {
    this.router.navigate(['.'], { queryParams: { page: event - 1 }, relativeTo: this.route });
  }
}
