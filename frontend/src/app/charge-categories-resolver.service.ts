import { Injectable } from '@angular/core';
import { ChargeCategoryModel } from './models/charge-category.model';
import { Resolve } from '@angular/router';
import { ChargeCategoryService } from './charge-category.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChargeCategoriesResolverService implements Resolve<Array<ChargeCategoryModel>> {
  constructor(private chargeCategoryService: ChargeCategoryService) {}

  resolve(): Observable<Array<ChargeCategoryModel>> {
    return this.chargeCategoryService.list();
  }
}
