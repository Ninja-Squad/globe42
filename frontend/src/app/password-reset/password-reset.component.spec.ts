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
import { ComponentTester } from 'ngx-speculoos';

class PasswordResetComponentTester extends ComponentTester<PasswordResetComponent> {
  constructor() {
    super(PasswordResetComponent);
  }

  get form() {
    return this.element('#password-reset-form');
  }

  get resetButton() {
    return this.button('#password-reset-button');
  }

  get updatedUserAlert() {
    return this.element('#updated-user');
  }
}

describe('PasswordResetComponent', () => {
  let fakeRouter: jasmine.SpyObj<Router>;
  let user: UserModel;
  let tester: PasswordResetComponentTester;

  beforeEach(() => {
    fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    user = { id: 42, login: 'jb', admin: false };
    const activatedRoute = {
      snapshot: { data: { user } }
    };

    TestBed.configureTestingModule({
      imports: [HttpClientModule, GlobeNgbModule.forRoot()],
      declarations: [PasswordResetComponent, PageTitleDirective],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: fakeRouter }
      ]
    });

    tester = new PasswordResetComponentTester();
    tester.detectChanges();
  });

  it('should reset password', () => {
    expect(tester.componentInstance.user).toEqual(user);
    expect(tester.componentInstance.updatedUser).toBeUndefined();

    expect(tester.form).not.toBeNull();
    expect(tester.resetButton).not.toBeNull();
    expect(tester.updatedUserAlert).toBeNull();

    const userService = TestBed.inject(UserService);
    const updatedUser = {
      id: 42,
      login: 'jb',
      generatedPassword: 'passw0rd'
    } as UserWithPasswordModel;
    spyOn(userService, 'resetPassword').and.returnValue(of(updatedUser));

    tester.resetButton.click();

    expect(tester.componentInstance.updatedUser).toBe(updatedUser);
    expect(tester.form).toBeNull();
    expect(tester.updatedUserAlert).not.toBeNull();
    expect(tester.updatedUserAlert).toContainText('jb');
    expect(tester.updatedUserAlert).toContainText('passw0rd');
  });
});
