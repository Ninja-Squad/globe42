import { TestBed } from '@angular/core/testing';
import { NowService } from './now.service';
import * as moment from 'moment';

describe('NowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NowService]
    });
  });

  it('should return now', () => {
    const nowService = TestBed.get(NowService);
    expect(nowService.now().diff(moment.now(), 'seconds')).toBeLessThan(1);
    expect(nowService.now()).not.toBe(nowService.now());
  });
});
