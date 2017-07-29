import { Injectable } from '@angular/core';
import { Moment } from 'moment/moment';
import * as moment from 'moment';

/**
 * A service providing the current time, as a Moment.
 * This service is only used to help with testing: a mock implementation can be passed in tests to fake the current time
 */
@Injectable()
export class NowService {
  now(): Moment {
    return moment();
  }
}
