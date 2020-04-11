import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChargeTypeModel } from './models/charge-type.model';
import { ChargeTypeCommand } from './models/charge-type.command';

@Injectable({ providedIn: 'root' })
export class ChargeTypeService {
  constructor(private http: HttpClient) {}

  list(): Observable<Array<ChargeTypeModel>> {
    return this.http.get<Array<ChargeTypeModel>>('/api/charge-types');
  }

  create(chargeTypeCommand: ChargeTypeCommand): Observable<ChargeTypeModel> {
    return this.http.post<ChargeTypeModel>('/api/charge-types', chargeTypeCommand);
  }

  get(typeId: number): Observable<ChargeTypeModel> {
    return this.http.get<ChargeTypeModel>(`/api/charge-types/${typeId}`);
  }

  update(id: number, chargeTypeCommand: ChargeTypeCommand): Observable<void> {
    return this.http.put<void>(`/api/charge-types/${id}`, chargeTypeCommand);
  }
}
