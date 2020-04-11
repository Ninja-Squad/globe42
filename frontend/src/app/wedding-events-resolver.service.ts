import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { WeddingEventModel } from './models/wedding-event.model';
import { WeddingEventService } from './wedding-event.service';
import { CurrentPersonService } from './current-person.service';

@Injectable({ providedIn: 'root' })
export class WeddingEventsResolverService implements Resolve<Array<WeddingEventModel>> {
  constructor(
    private currentPersonService: CurrentPersonService,
    private weddingEventService: WeddingEventService
  ) {}

  resolve(): Observable<Array<WeddingEventModel>> {
    return this.weddingEventService.list(this.currentPersonService.snapshot.id);
  }
}
