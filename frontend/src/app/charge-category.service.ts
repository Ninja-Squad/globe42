import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChargeCategoryModel } from './models/charge-category.model';
import { Observable } from 'rxjs';
import { ChargeCategoryCommand } from './models/charge-category.command';

@Injectable({ providedIn: 'root' })
export class ChargeCategoryService {

  constructor(private http: HttpClient) { }

  list(): Observable<Array<ChargeCategoryModel>> {
    return this.http.get<Array<ChargeCategoryModel>>('/api/charge-categories');
  }

  create(chargeCategoryCommand: ChargeCategoryCommand): Observable<ChargeCategoryModel> {
    return this.http.post<ChargeCategoryModel>('/api/charge-categories', chargeCategoryCommand);
  }

  get(typeId: number): Observable<ChargeCategoryModel> {
    return this.http.get<ChargeCategoryModel>(`/api/charge-categories/${typeId}`);
  }

  update(id: number, chargeCategoryCommand: ChargeCategoryCommand): Observable<void> {
    return this.http.put<void>(`/api/charge-categories/${id}`, chargeCategoryCommand);
  }
}
