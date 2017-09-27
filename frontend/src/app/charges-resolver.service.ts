import { Injectable } from '@angular/core';
import { ChargeService } from './charge.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ChargeModel } from './models/charge.model';
import { PersonModel } from './models/person.model';

@Injectable()
export class ChargesResolverService implements Resolve<Array<ChargeModel>> {

  constructor(private chargeService: ChargeService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<ChargeModel>> {
    const person: PersonModel = route.parent.data['person'];
    return this.chargeService.list(person.id);
  }
}
