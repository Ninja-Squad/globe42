import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MembershipModel } from './models/membership.model';
import { MembershipCommand } from './models/membership.command';
import { tap } from 'rxjs/operators';

function url(personId: number): string {
  return `/api/persons/${personId}/memberships`;
}

@Injectable({ providedIn: 'root' })
export class MembershipService {
  currentMembership$ = new Subject<MembershipModel>();

  constructor(private http: HttpClient) {}

  list(personId: number): Observable<Array<MembershipModel>> {
    return this.http.get<Array<MembershipModel>>(url(personId));
  }

  getCurrent(personId: number): Observable<MembershipModel | null> {
    return this.http.get<MembershipModel>(url(personId) + '/current');
  }

  createOld(personId: number, command: MembershipCommand): Observable<MembershipModel> {
    return this.http.post<MembershipModel>(url(personId), command);
  }

  deleteOld(personId: number, membershipId: number): Observable<void> {
    return this.http.delete<void>(url(personId) + '/' + membershipId);
  }

  createCurrent(personId: number, command: MembershipCommand): Observable<MembershipModel> {
    return this.http
      .post<MembershipModel>(url(personId), command)
      .pipe(tap(membership => this.currentMembership$.next(membership)));
  }

  deleteCurrent(personId: number, membershipId: number): Observable<void> {
    return this.http
      .delete<void>(url(personId) + '/' + membershipId)
      .pipe(tap(membership => this.currentMembership$.next(null)));
  }
}
