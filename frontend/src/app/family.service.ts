import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FamilyModel } from './models/family.model';
import { Observable } from 'rxjs';
import { FamilyCommand } from './models/family.command';

function url(personId: number) {
  return `/api/persons/${personId}/family`;
}

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  constructor(private http: HttpClient) { }

  get(personId: number): Observable<FamilyModel | null> {
    return this.http.get<FamilyModel>(url(personId));
  }

  delete(personId: number): Observable<void> {
    return this.http.delete<void>(url(personId));
  }

  save(personId: number, command: FamilyCommand): Observable<void> {
    return this.http.put<void>(url(personId), command);
  }
}
