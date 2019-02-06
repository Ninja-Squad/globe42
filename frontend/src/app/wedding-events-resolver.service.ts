import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PersonModel } from './models/person.model';
import { Observable } from 'rxjs';
import { WeddingEventModel } from './models/wedding-event.model';
import { WeddingEventService } from './wedding-event.service';

@Injectable({ providedIn: 'root' })
export class WeddingEventsResolverService implements Resolve<Array<WeddingEventModel>> {

  constructor(private weddingEventService: WeddingEventService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<WeddingEventModel>> {
    const person: PersonModel = route.parent.data.person;
    return this.weddingEventService.list(person.id);
  }
}
