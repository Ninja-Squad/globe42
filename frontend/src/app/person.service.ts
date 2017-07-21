import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PersonIdentityModel, PersonModel } from './models/person.model';
import { HttpClient } from '@angular/common/http';
import { PersonCommand } from './models/person.command';

@Injectable()
export class PersonService {

  constructor(private http: HttpClient) { }

  get(id: number): Observable<PersonModel> {
    return this.http.get(`/api/persons/${id}`);
  }

  update(id: number, person: PersonCommand): Observable<void> {
    return this.http.put<void>(`/api/persons/${id}`, person);
  }

  create(person: PersonCommand): Observable<PersonModel> {
    return this.http.post(`/api/persons`, person);
  }

  list(): Observable<Array<PersonIdentityModel>> {
    return this.http.get('/api/persons');
  }

}
