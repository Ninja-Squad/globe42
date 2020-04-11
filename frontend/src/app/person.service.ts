import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PersonIdentityModel, PersonModel } from './models/person.model';
import { HttpClient } from '@angular/common/http';
import { PersonCommand, PersonDeathCommand } from './models/person.command';

@Injectable({ providedIn: 'root' })
export class PersonService {
  constructor(private http: HttpClient) {}

  get(id: number): Observable<PersonModel> {
    return this.http.get<PersonModel>(`/api/persons/${id}`);
  }

  update(id: number, person: PersonCommand): Observable<void> {
    return this.http.put<void>(`/api/persons/${id}`, person);
  }

  create(person: PersonCommand): Observable<PersonModel> {
    return this.http.post<PersonModel>(`/api/persons`, person);
  }

  list(): Observable<Array<PersonIdentityModel>> {
    return this.http.get<Array<PersonIdentityModel>>('/api/persons');
  }

  listDeleted(): Observable<Array<PersonIdentityModel>> {
    return this.http.get<Array<PersonIdentityModel>>('/api/persons?deleted=true');
  }

  delete(id: number) {
    return this.http.delete<void>(`/api/persons/${id}`);
  }

  resurrect(id: number) {
    return this.http.delete<void>(`/api/persons/${id}/deletion`);
  }

  signalDeath(id: number, command: PersonDeathCommand): Observable<void> {
    return this.http.put<void>(`/api/persons/${id}/death`, command);
  }
}
