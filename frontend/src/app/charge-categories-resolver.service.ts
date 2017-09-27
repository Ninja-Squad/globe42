import { Injectable } from '@angular/core';
import { ChargeCategoryModel } from './models/charge-category.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ChargeCategoryService } from './charge-category.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChargeCategoriesResolverService implements Resolve<Array<ChargeCategoryModel>> {

  constructor(private chargeCategoryService: ChargeCategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ChargeCategoryModel>> {
    return this.chargeCategoryService.list();
  }


}
