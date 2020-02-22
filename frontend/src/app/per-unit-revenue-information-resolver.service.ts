import { Injectable } from '@angular/core';
import { PerUnitRevenueInformationService } from './per-unit-revenue-information.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PerUnitRevenueInformationModel } from './models/per-unit-revenue-information.model';
import { Observable } from 'rxjs';
import { CurrentPersonService } from './current-person.service';

@Injectable({ providedIn: 'root' })
export class PerUnitRevenueInformationResolverService implements Resolve<PerUnitRevenueInformationModel | null> {

  constructor(private currentPersonService: CurrentPersonService,
              private perUnitRevenueInformationService: PerUnitRevenueInformationService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PerUnitRevenueInformationModel | null> {
    const personId = +(route.paramMap.get('id') ?? this.currentPersonService.snapshot.id);
    return this.perUnitRevenueInformationService.get(personId);
  }
}
