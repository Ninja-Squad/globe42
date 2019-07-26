import { TestBed } from '@angular/core/testing';

import { WeddingEventsResolverService } from './wedding-events-resolver.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { WeddingEventService } from './wedding-event.service';
import { WeddingEventModel } from './models/wedding-event.model';
import { CurrentPersonService } from './current-person.service';

describe('WeddingEventsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });

    const currentPersonService: CurrentPersonService = TestBed.get(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 });
  });

  it('should resolve the list of wedding events of a person', () => {
    const weddingEventService = TestBed.get(WeddingEventService);
    const events = of([{ id: 1 }] as Array<WeddingEventModel>);

    spyOn(weddingEventService, 'list').and.returnValue(events);

    const resolver = TestBed.get(WeddingEventsResolverService);
    const result = resolver.resolve();
    expect(result).toBe(events);
    expect(weddingEventService.list).toHaveBeenCalledWith(42);
  });
});
