import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { PersonModel } from './models/person.model';
import { Http } from '@angular/http';

@Injectable()
export class PersonService {

  constructor(private http: Http) { }

  get(id: number): Observable<PersonModel> {
    return this.http.get(`/api/persons/${id}`).map(response => response.json());
  }

  update(person: PersonModel): Observable<any> {
    return this.http.put(`/api/persons/${person.id}`, person);
  }

  create(person: PersonModel): Observable<PersonModel> {
    return this.http.post(`/api/persons`, person).map(response => response.json());
  }

  list(): Observable<Array<PersonModel>> {
    return this.http.get('/api/persons').map(response => response.json());
  }

}
