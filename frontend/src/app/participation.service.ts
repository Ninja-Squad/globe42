import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType, ParticipationModel } from './models/participation.model';
import { PersonIdentityModel } from './models/person.model';

@Injectable({ providedIn: 'root' })
export class ParticipationService {

  constructor(private http: HttpClient) { }

  list(personId: number): Observable<Array<ParticipationModel>> {
    return this.http.get<Array<ParticipationModel>>(`/api/persons/${personId}/participations`);
  }

  create(personId: number, activityType: ActivityType): Observable<ParticipationModel> {
    const command = { activityType };
    return this.http.post<ParticipationModel>(`/api/persons/${personId}/participations`, command);
  }

  delete(personId: number, participationId: number): Observable<void> {
    return this.http.delete<void>(`/api/persons/${personId}/participations/${participationId}`);
  }

  listParticipants(activityType: ActivityType): Observable<Array<PersonIdentityModel>> {
    return this.http.get<Array<PersonIdentityModel>>(`/api/activity-types/${activityType}/participants`);
  }
}
