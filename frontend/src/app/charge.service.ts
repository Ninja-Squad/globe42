import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChargeModel } from './models/charge.model';
import { ChargeCommand } from './models/charge.command';

@Injectable({ providedIn: 'root' })
export class ChargeService {

  constructor(private http: HttpClient) { }

  list(personId: number): Observable<Array<ChargeModel>> {
    return this.http.get<Array<ChargeModel>>(`/api/persons/${personId}/charges`);
  }

  delete(personId: number, chargeId: number): Observable<void> {
    return this.http.delete<void>(`/api/persons/${personId}/charges/${chargeId}`);
  }

  create(personId: number, command: ChargeCommand): Observable<ChargeModel> {
    return this.http.post<ChargeModel>(`/api/persons/${personId}/charges`, command);
  }
}
