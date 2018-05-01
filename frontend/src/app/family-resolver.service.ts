import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { FamilyModel } from './models/family.model';
import { FamilyService } from './family.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyResolverService implements Resolve<FamilyModel | null> {

  constructor(private familyService: FamilyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<FamilyModel | null> {
    const id = +(route.paramMap.get('id') || route.parent.paramMap.get('id'));
    return this.familyService.get(id);
  }
}
