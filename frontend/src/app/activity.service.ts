import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, ActivityCommand, ActivityModel, ActivityReport } from './models/activity.model';
import { Page } from './models/page';
import { Observable } from 'rxjs';
import { ActivityType, activityType } from './models/activity-type.model';
import { map } from 'rxjs/operators';
import { sortBy } from './utils';
import { displayFullname } from './fullname.pipe';

function toActivity(model: ActivityModel): Activity {
  return {
    ...model,
    type: activityType(model.type),
    participants: sortBy(model.participants, displayFullname)
  };
}

function toActivityPage(page: Page<ActivityModel>): Page<Activity> {
  return {
    ...page,
    content: page.content.map(toActivity)
  };
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  list(page: number): Observable<Page<Activity>> {
    return this.http
      .get<Page<ActivityModel>>('/api/activities', { params: { page: `${page}` } })
      .pipe(map(modelPage => toActivityPage(modelPage)));
  }

  get(activityId: number): Observable<Activity> {
    return this.http
      .get<ActivityModel>(`/api/activities/${activityId}`)
      .pipe(map(model => toActivity(model)));
  }

  create(command: ActivityCommand): Observable<Activity> {
    return this.http
      .post<ActivityModel>(`/api/activities`, command)
      .pipe(map(model => toActivity(model)));
  }

  update(activityId: number, command: ActivityCommand): Observable<void> {
    return this.http.put<void>(`/api/activities/${activityId}`, command);
  }

  delete(activityId: number): Observable<void> {
    return this.http.delete<void>(`/api/activities/${activityId}`);
  }

  report(type: ActivityType, from: string, to: string): Observable<ActivityReport> {
    const params = { type, from, to };
    return this.http
      .get<ActivityReport>('/api/activities/reports', { params })
      .pipe(
        map(report => ({
          ...report,
          presences: sortBy(report.presences, presence => displayFullname(presence.person))
        }))
      );
  }
}
