import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ChargeTypeModel } from './models/charge-type.model';
import { ChargeTypeService } from './charge-type.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChargeTypesResolverService implements Resolve<Array<ChargeTypeModel>> {

  constructor(private chargeTypeService: ChargeTypeService) { }

  resolve(): Observable<Array<ChargeTypeModel>> {
    return this.chargeTypeService.list();
  }
}
