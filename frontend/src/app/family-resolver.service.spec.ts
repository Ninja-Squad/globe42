import { TestBed } from '@angular/core/testing';

import { FamilyResolverService } from './family-resolver.service';
import { FamilyService } from './family.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FamilyModel } from './models/family.model';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';

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

    familyService = TestBed.get(FamilyService);
    family = of({} as FamilyModel);
    spyOn(familyService, 'get').and.returnValue(family);
    resolver = TestBed.get(FamilyResolverService);
  });

  it('should resolve family when editing it', () => {
    const route = {
      paramMap: convertToParamMap({
        id: 42
      })
    } as ActivatedRouteSnapshot;
    expect(resolver.resolve(route)).toBe(family);
  });

  it('should resolve family when displaying it', () => {
    const route: any = {
      parent: {
        data: {
          person: {
            id: 42
          }
        }
      },
      paramMap: convertToParamMap({})
    };
    expect(resolver.resolve(route)).toBe(family);
  });
});
