import { TestBed } from '@angular/core/testing';
import { NowService } from './now.service';

describe('NowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NowService]
    });
  });

  it('should return now', () => {
    const nowService = TestBed.get(NowService);
    expect(Math.abs(nowService.now().diffNow().as('milliseconds'))).toBeLessThan(1000);
    expect(nowService.now()).not.toBe(nowService.now());
  });
});
