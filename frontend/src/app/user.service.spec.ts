import { inject, TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UserService]
  }));

  it('should be implemented later', () => {
    const service = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
