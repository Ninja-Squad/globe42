import { TestBed } from '@angular/core/testing';

import { PerUnitRevenueInformationResolverService } from './per-unit-revenue-information-resolver.service';
import { PerUnitRevenueInformationService } from './per-unit-revenue-information.service';
import { PerUnitRevenueInformationModel } from './models/per-unit-revenue-information.model';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

describe('PerUnitRevenueInformationResolverService', () => {

  let mockPerUnitRevenueInformationService: PerUnitRevenueInformationService;
  let info: Observable<PerUnitRevenueInformationModel>;
  let resolver: PerUnitRevenueInformationResolverService;

  beforeEach(() => {
    mockPerUnitRevenueInformationService =
      jasmine.createSpyObj('perUnitRevenueInformationService', ['get']);
    info = of({} as PerUnitRevenueInformationModel);
    (mockPerUnitRevenueInformationService.get as jasmine.Spy).and.returnValue(info);
    TestBed.configureTestingModule({
      providers: [
        PerUnitRevenueInformationResolverService,
        { provide: PerUnitRevenueInformationService, useValue: mockPerUnitRevenueInformationService }
      ]
    });

    resolver = TestBed.get(PerUnitRevenueInformationResolverService);
  });

  it('should load when person ID is set on the current route', () => {
    const route = {
      paramMap: convertToParamMap({
        id: '42'
      })
    } as ActivatedRouteSnapshot;

    const result = resolver.resolve(route);
    expect(result).toBe(info);
    expect(mockPerUnitRevenueInformationService.get).toHaveBeenCalledWith(42);
  });

  it('should load when person data is set on the parent route', () => {
    const route = {
      paramMap: convertToParamMap({}),
      parent: {
        data: {
          person: {
            id: 42
          }
        }
      }
    } as any;

    const result = resolver.resolve(route);
    expect(result).toBe(info);
    expect(mockPerUnitRevenueInformationService.get).toHaveBeenCalledWith(42);
  });
});
