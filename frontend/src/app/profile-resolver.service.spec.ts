import { TestBed } from '@angular/core/testing';

import { ProfileResolverService } from './profile-resolver.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ProfileModel } from './models/user.model';
import { CurrentUserService } from './current-user/current-user.service';

describe('ProfileResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should resolve profile', () => {
    const expectedResult = of({ email: 'joe@nowhere.com'} as ProfileModel);

    const currentUserService = TestBed.inject(CurrentUserService);
    spyOn(currentUserService, 'getProfile').and.returnValue(expectedResult);

    const resolver = TestBed.inject(ProfileResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResult);
  });
});
