import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ChargeTypeModel } from './models/charge-type.model';
import { ChargeTypeService } from './charge-type.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChargeTypesResolverService implements Resolve<Array<ChargeTypeModel>> {

  constructor(private chargeTypeService: ChargeTypeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ChargeTypeModel>> {
    return this.chargeTypeService.list();
  }
}
