import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from '../models/activity.model';
import { ConfirmService } from '../confirm.service';
import { switchMap } from 'rxjs/operators';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'gl-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  activity: Activity;

  constructor(
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activity = this.route.snapshot.data.activity;
  }

  delete() {
    this.confirmService
      .confirm({
        message: 'Voulez-vous vraiment supprimer cette activité\u00a0?'
      })
      .pipe(switchMap(() => this.activityService.delete(this.activity.id)))
      .subscribe(() => this.router.navigate(['/activities']));
  }
}
