import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NetworkMemberModel } from './models/network-member.model';
import { NetworkMemberService } from './network-member.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkMembersResolverService implements Resolve<Array<NetworkMemberModel>> {

  constructor(private service: NetworkMemberService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<NetworkMemberModel>> {
    return this.service.list(route.parent.data.person.id);
  }
}
