import { TestBed } from '@angular/core/testing';

import { ActivitiesResolverService } from './activities-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { ActivityService } from './activity.service';
import { Activity } from './models/activity.model';
import { Page } from './models/page';
import { fakeSnapshot } from 'ngx-speculoos';

describe('ActivitiesResolverService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should retrieve a page of activities', () => {
    const activityService = TestBed.inject(ActivityService);
    const expectedResults = of({ number: 2 } as Page<Activity>);

    spyOn(activityService, 'list').and.returnValue(expectedResults);

    const resolver = TestBed.inject(ActivitiesResolverService);
    const result = resolver.resolve(fakeSnapshot({ queryParams: { page: 2 } }));

    expect(result).toBe(expectedResults);
    expect(activityService.list).toHaveBeenCalledWith(2);
  });
});
