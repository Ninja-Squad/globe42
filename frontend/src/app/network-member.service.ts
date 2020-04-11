import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NetworkMemberCommand } from './models/network-member.command';
import { NetworkMemberModel } from './models/network-member.model';

function url(personId: number): string {
  return `/api/persons/${personId}/network-members`;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkMemberService {
  constructor(private http: HttpClient) {}

  list(personId: number): Observable<Array<NetworkMemberModel>> {
    return this.http.get<Array<NetworkMemberModel>>(url(personId));
  }

  delete(personId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${url(personId)}/${id}`);
  }

  create(personId: number, command: NetworkMemberCommand): Observable<NetworkMemberModel> {
    return this.http.post<NetworkMemberModel>(url(personId), command);
  }

  update(personId: number, id: number, command: NetworkMemberCommand): Observable<void> {
    return this.http.put<void>(`${url(personId)}/${id}`, command);
  }
}
