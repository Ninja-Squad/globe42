import { Injectable } from '@angular/core';
import { ChargeCategoryModel } from './models/charge-category.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ChargeCategoryService } from './charge-category.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChargeCategoryResolverService implements Resolve<ChargeCategoryModel> {

  constructor(private chargeCategoryService: ChargeCategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChargeCategoryModel> {
    const typeId = +route.paramMap.get('id');
    return this.chargeCategoryService.get(typeId);
  }

}
