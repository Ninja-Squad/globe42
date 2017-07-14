import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PersonModel } from './models/person.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PersonService {

  constructor(private http: HttpClient) { }

  get(id: number): Observable<PersonModel> {
    return this.http.get(`/api/persons/${id}`);
  }

  update(person: PersonModel): Observable<void> {
    return this.http.put<void>(`/api/persons/${person.id}`, person);
  }

  create(person: PersonModel): Observable<PersonModel> {
    return this.http.post(`/api/persons`, person);
  }

  list(): Observable<Array<PersonModel>> {
    return this.http.get('/api/persons');
  }

}
