import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MembershipsResolverService } from './memberships-resolver.service';
import { MembershipService } from './membership.service';
import { MembershipModel } from './models/membership.model';
import { CurrentPersonService } from './current-person.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MembershipsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 });
  });

  it('should resolve the list of memberships of a person', () => {
    const membershipService = TestBed.inject(MembershipService);
    const memberships = of([{ id: 2 }] as Array<MembershipModel>);

    spyOn(membershipService, 'list').and.returnValue(memberships);

    const resolver: MembershipsResolverService = TestBed.inject(MembershipsResolverService);
    const result = resolver.resolve();
    expect(result).toBe(memberships);
    expect(membershipService.list).toHaveBeenCalledWith(42);
  });
});
