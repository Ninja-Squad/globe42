import { TestBed } from '@angular/core/testing';

import { WeddingEventsResolverService } from './wedding-events-resolver.service';
import { PersonModel } from './models/person.model';
import { of } from 'rxjs/observable/of';
import { HttpClientModule } from '@angular/common/http';
import { WeddingEventService } from './wedding-event.service';
import { WeddingEventModel } from './models/wedding-event.model';

describe('WeddingEventsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeddingEventsResolverService, WeddingEventService],
      imports: [HttpClientModule]
    });
  });

  it('should resolve the list of wedding events of a person', () => {
    const weddingEventService = TestBed.get(WeddingEventService);
    const events = of([{ id: 1 }] as Array<WeddingEventModel>);

    spyOn(weddingEventService, 'list').and.returnValue(events);

    const resolver = TestBed.get(WeddingEventsResolverService);
    const route: any = { parent: { data: { person: { id: 42 } as PersonModel } } };
    const result = resolver.resolve(route, null);
    expect(result).toBe(events);
    expect(weddingEventService.list).toHaveBeenCalledWith(42);
  });
});
