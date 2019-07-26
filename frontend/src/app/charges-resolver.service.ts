import { Injectable } from '@angular/core';
import { ChargeService } from './charge.service';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ChargeModel } from './models/charge.model';
import { CurrentPersonService } from './current-person.service';

@Injectable({ providedIn: 'root' })
export class ChargesResolverService implements Resolve<Array<ChargeModel>> {

  constructor(private currentPersonService: CurrentPersonService,
              private chargeService: ChargeService) { }

  resolve(): Observable<Array<ChargeModel>> {
    return this.chargeService.list(this.currentPersonService.snapshot.id);
  }
}
