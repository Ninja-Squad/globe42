import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ChargeTypeModel } from './models/charge-type.model';
import { ChargeTypeService } from './charge-type.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChargeTypeResolverService implements Resolve<ChargeTypeModel> {
  constructor(private chargeTypeService: ChargeTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChargeTypeModel> {
    const typeId = +route.paramMap.get('id');
    return this.chargeTypeService.get(typeId);
  }
}
