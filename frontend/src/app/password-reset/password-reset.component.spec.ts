import { TestBed } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { UserModel } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserWithPasswordModel } from '../models/user-with-password.model';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';

describe('PasswordResetComponent', () => {
  const user: UserModel = { id: 42, login: 'jb', admin: false };
  const activatedRoute = {
    snapshot: { data: { user } }
  };
  const fakeRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, GlobeNgbModule.forRoot()],
      declarations: [PasswordResetComponent, PageTitleDirective],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: fakeRouter }
      ]
    })
  );

  it('should reset password', () => {
    const fixture = TestBed.createComponent(PasswordResetComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.user).toEqual(user);
    expect(fixture.componentInstance.updatedUser).toBeUndefined();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#password-reset-form')).not.toBeNull();
    const resetButton = nativeElement.querySelector('#password-reset-button');
    expect(resetButton).not.toBeNull();
    expect(nativeElement.querySelector('#updated-user')).toBeNull();

    const userService = TestBed.inject(UserService);
    const updatedUser = {
      id: 42,
      login: 'jb',
      generatedPassword: 'passw0rd'
    } as UserWithPasswordModel;
    spyOn(userService, 'resetPassword').and.returnValue(of(updatedUser));
    resetButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.updatedUser).toBe(updatedUser);
    expect(nativeElement.querySelector('#password-reset-form')).toBeNull();
    const updatedUserAlert = nativeElement.querySelector('#updated-user');
    expect(updatedUserAlert).not.toBeNull();
    expect(updatedUserAlert.textContent).toContain('jb');
    expect(updatedUserAlert.textContent).toContain('passw0rd');
  });
});
