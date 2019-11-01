import { TestBed } from '@angular/core/testing';

import { NetworkMembersResolverService } from './network-members-resolver.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NetworkMemberService } from './network-member.service';
import { Observable, of } from 'rxjs';
import { NetworkMemberModel } from './models/network-member.model';
import { CurrentPersonService } from './current-person.service';

describe('NetworkMembersResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 });
  });

  it('should resolve network members', () => {
    const resolver: NetworkMembersResolverService = TestBed.inject(NetworkMembersResolverService);
    const service: NetworkMemberService = TestBed.inject(NetworkMemberService);

    const members: Observable<Array<NetworkMemberModel>> = of([]);
    spyOn(service, 'list').and.returnValue(members);

    expect(resolver.resolve()).toBe(members);
    expect(service.list).toHaveBeenCalledWith(42);
  });
});
