import { TestBed } from '@angular/core/testing';

import { NetworkMembersResolverService } from './network-members-resolver.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NetworkMemberService } from './network-member.service';
import { Observable, of } from 'rxjs';
import { NetworkMemberModel } from './models/network-member.model';

describe('NetworkMembersResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should resolve network members', () => {
    const resolver: NetworkMembersResolverService = TestBed.get(NetworkMembersResolverService);
    const service: NetworkMemberService = TestBed.get(NetworkMemberService);

    const members: Observable<Array<NetworkMemberModel>> = of([]);
    spyOn(service, 'list').and.returnValue(members);

    const route = {
      parent: {
        data: {
          person: {
            id: 42
          }
        }
      }
    } as any;

    expect(resolver.resolve(route)).toBe(members);
  });
});
