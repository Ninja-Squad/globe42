import { TestBed } from '@angular/core/testing';

import { ActivityResolverService } from './activity-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivityService } from './activity.service';
import { of } from 'rxjs';
import { Activity } from './models/activity.model';
import { fakeSnapshot } from 'ngx-speculoos';

describe('ActivityResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve an activity', () => {
    const activityService = TestBed.inject(ActivityService);
    const expectedResult = of({ id: 42 } as Activity);

    spyOn(activityService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.inject(ActivityResolverService);
    const result = resolver.resolve(fakeSnapshot({ params: { activityId: 42 } }));

    expect(result).toBe(expectedResult);
    expect(activityService.get).toHaveBeenCalledWith(42);
  });
});
