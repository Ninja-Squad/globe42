import { TestBed } from '@angular/core/testing';

import { FamilyResolverService } from './family-resolver.service';
import { FamilyService } from './family.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FamilyModel } from './models/family.model';
import { Observable, of } from 'rxjs';
import { CurrentPersonService } from './current-person.service';
import { fakeSnapshot } from 'ngx-speculoos';

describe('FamilyResolverService', () => {
  let familyService: FamilyService;
  let resolver: FamilyResolverService;
  let family: Observable<FamilyModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 54 });

    familyService = TestBed.inject(FamilyService);
    family = of({} as FamilyModel);
    spyOn(familyService, 'get').and.returnValue(family);
    resolver = TestBed.inject(FamilyResolverService);
  });

  it('should resolve family when editing it', () => {
    const route = fakeSnapshot({
      params: {
        id: 42
      }
    });
    expect(resolver.resolve(route)).toBe(family);
    expect(familyService.get).toHaveBeenCalledWith(42);
  });

  it('should resolve family when displaying it', () => {
    const route = fakeSnapshot({ params: {}});
    expect(resolver.resolve(route)).toBe(family);
    expect(familyService.get).toHaveBeenCalledWith(54);
  });
});
