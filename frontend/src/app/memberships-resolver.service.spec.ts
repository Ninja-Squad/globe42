import { of } from 'rxjs/observable/of';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MembershipsResolverService } from './memberships-resolver.service';
import { MembershipService } from './membership.service';
import { MembershipModel } from './models/membership.model';
import { PersonModel } from './models/person.model';

describe('MembershipsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MembershipsResolverService, MembershipService],
      imports: [HttpClientModule]
    });
  });

  it('should resolve the list of memberships of a person', () => {
    const membershipService = TestBed.get(MembershipService);
    const memberships = of([{ id: 2 }] as Array<MembershipModel>);

    spyOn(membershipService, 'list').and.returnValue(memberships);

    const resolver: MembershipsResolverService = TestBed.get(MembershipsResolverService);
    const route: any = {
      parent: {
        data: {
          person: { id: 42 } as PersonModel
        }
      }
    };
    const result = resolver.resolve(route);
    expect(result).toBe(memberships);
    expect(membershipService.list).toHaveBeenCalledWith(42);
  });
});
