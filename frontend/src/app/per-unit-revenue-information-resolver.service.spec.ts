import { TestBed } from '@angular/core/testing';

import { PerUnitRevenueInformationResolverService } from './per-unit-revenue-information-resolver.service';
import { PerUnitRevenueInformationService } from './per-unit-revenue-information.service';
import { PerUnitRevenueInformationModel } from './models/per-unit-revenue-information.model';
import { Observable, of } from 'rxjs';
import { createMock, fakeSnapshot } from 'ngx-speculoos';
import { CurrentPersonService } from './current-person.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PerUnitRevenueInformationResolverService', () => {
  let mockPerUnitRevenueInformationService: jasmine.SpyObj<PerUnitRevenueInformationService>;
  let info: Observable<PerUnitRevenueInformationModel>;
  let resolver: PerUnitRevenueInformationResolverService;

  beforeEach(() => {
    mockPerUnitRevenueInformationService = createMock(PerUnitRevenueInformationService);
    info = of({} as PerUnitRevenueInformationModel);
    mockPerUnitRevenueInformationService.get.and.returnValue(info);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: PerUnitRevenueInformationService,
          useValue: mockPerUnitRevenueInformationService
        }
      ]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 54 });

    resolver = TestBed.inject(PerUnitRevenueInformationResolverService);
  });

  it('should load when person ID is set on the current route', () => {
    const routeSnapshot = fakeSnapshot({
      params: {
        id: '42'
      }
    });

    const result = resolver.resolve(routeSnapshot);
    expect(result).toBe(info);
    expect(mockPerUnitRevenueInformationService.get).toHaveBeenCalledWith(42);
  });

  it('should load when person is in the currentPersonService', () => {
    const routeSnapshot = fakeSnapshot({ params: {} });

    const result = resolver.resolve(routeSnapshot);
    expect(result).toBe(info);
    expect(mockPerUnitRevenueInformationService.get).toHaveBeenCalledWith(54);
  });
});
