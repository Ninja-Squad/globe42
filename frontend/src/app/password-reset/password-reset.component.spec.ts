import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { UserModel } from '../models/user.model';
import { AppModule } from '../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/Observable';
import { UserWithPasswordModel } from '../models/user-with-password.model';

describe('PasswordResetComponent', () => {
  const user: UserModel = {id: 42, login: 'jb', admin: false};
  const activatedRoute = {
    snapshot: {data: {user}}
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{provide: ActivatedRoute, useValue: activatedRoute}]
  }));

  it('should reset password', async(() => {
    const fixture = TestBed.createComponent(PasswordResetComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.user).toEqual(user);
    expect(fixture.componentInstance.updatedUser).toBeUndefined();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#password-reset-form')).not.toBeNull();
    const resetButton = nativeElement.querySelector('#password-reset-button');
    expect(resetButton).not.toBeNull();
    expect(nativeElement.querySelector('#updated-user')).toBeNull();

    const userService = TestBed.get(UserService);
    const updatedUser = {id: 42, login: 'jb', generatedPassword: 'passw0rd'} as UserWithPasswordModel;
    spyOn(userService, 'resetPassword').and.returnValue(Observable.of(updatedUser))
    resetButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.updatedUser).toBe(updatedUser);
    expect(nativeElement.querySelector('#password-reset-form')).toBeNull();
    let updatedUserAlert = nativeElement.querySelector('#updated-user');
    expect(updatedUserAlert).not.toBeNull();
    expect(updatedUserAlert.textContent).toContain('jb');
    expect(updatedUserAlert.textContent).toContain('passw0rd');
  }));
});
