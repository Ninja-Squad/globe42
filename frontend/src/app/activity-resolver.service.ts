import { Injectable } from '@angular/core';
import { ActivityService } from './activity.service';
import { Activity } from './models/activity.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityResolverService implements Resolve<Activity> {
  constructor(private activityService: ActivityService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Activity> {
    return this.activityService.get(+route.paramMap.get('activityId'));
  }
}
