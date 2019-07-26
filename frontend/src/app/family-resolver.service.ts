import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { FamilyModel } from './models/family.model';
import { FamilyService } from './family.service';
import { Observable } from 'rxjs';
import { CurrentPersonService } from './current-person.service';

@Injectable({
  providedIn: 'root'
})
export class FamilyResolverService implements Resolve<FamilyModel | null> {

  constructor(private currentPersonService: CurrentPersonService,
              private familyService: FamilyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<FamilyModel | null> {
    const id = +(route.paramMap.get('id') || this.currentPersonService.snapshot.id);
    return this.familyService.get(id);
  }
}
