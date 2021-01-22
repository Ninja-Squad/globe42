import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Activity } from './models/activity.model';
import { Page } from './models/page';
import { ActivityService } from './activity.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesResolverService implements Resolve<Page<Activity>> {
  constructor(private activityService: ActivityService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Page<Activity>> {
    return this.activityService.list(+route.queryParamMap.get('page'));
  }
}
