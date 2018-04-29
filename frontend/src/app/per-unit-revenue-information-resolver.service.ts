import { Injectable } from '@angular/core';
import { PerUnitRevenueInformationService } from './per-unit-revenue-information.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PerUnitRevenueInformationModel } from './models/per-unit-revenue-information.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PerUnitRevenueInformationResolverService implements Resolve<PerUnitRevenueInformationModel | null> {

  constructor(private perUnitRevenueInformationService: PerUnitRevenueInformationService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PerUnitRevenueInformationModel | null> {
    const personId = +(route.paramMap.get('id') || route.parent.data['person'].id);
    return this.perUnitRevenueInformationService.get(personId);
  }
}
