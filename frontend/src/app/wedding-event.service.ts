import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeddingEventModel } from './models/wedding-event.model';
import { WeddingEventCommand } from './models/wedding-event.command';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WeddingEventService {

  constructor(private http: HttpClient) { }

  list(personId: number): Observable<Array<WeddingEventModel>> {
    return this.http.get<Array<WeddingEventModel>>(`/api/persons/${personId}/wedding-events`);
  }

  delete(personId: number, id: number): Observable<void> {
    return this.http.delete<void>(`/api/persons/${personId}/wedding-events/${id}`);
  }

  create(personId: number, command: WeddingEventCommand): Observable<WeddingEventModel> {
    return this.http.post<WeddingEventModel>(`/api/persons/${personId}/wedding-events`, command);
  }
}
