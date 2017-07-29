import { TestBed, inject } from '@angular/core/testing';

import { NowService } from './now.service';

describe('NowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NowService]
    });
  });

  it('should be created', inject([NowService], (service: NowService) => {
    expect(service).toBeTruthy();
  }));
});
