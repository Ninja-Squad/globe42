import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NetworkMemberModel } from './models/network-member.model';
import { NetworkMemberService } from './network-member.service';
import { Observable } from 'rxjs';
import { CurrentPersonService } from './current-person.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkMembersResolverService implements Resolve<Array<NetworkMemberModel>> {

  constructor(private currentPersonService: CurrentPersonService,
              private service: NetworkMemberService) { }

  resolve(): Observable<Array<NetworkMemberModel>> {
    return this.service.list(this.currentPersonService.snapshot.id);
  }
}
