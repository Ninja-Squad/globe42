import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { dateToIso, isoToDate } from './utils';

/**
 * Service allowing dates, selected by an NgbDatepicker, to be stored as ISO strings (yyyy-MM-dd)
 */
@Injectable()
export class DateStringAdapterService extends NgbDateAdapter<string> {

  fromModel(value: string): NgbDateStruct {
    return isoToDate(value);
  }

  toModel(date: NgbDateStruct): string {
    return dateToIso(date);
  }
}
