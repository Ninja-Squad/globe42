import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpModule } from '@angular/http';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [UserService],
    imports: [HttpModule]
  }));

  it('should be implemented later', () => {
    const service = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
