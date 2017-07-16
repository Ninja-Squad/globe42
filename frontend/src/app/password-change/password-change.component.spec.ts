import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppModule } from 'app/app.module';
import { PasswordChangeComponent } from './password-change.component';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

describe('PasswordChangeComponent', () => {

  const fakeRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
      { provide: Router, useValue: fakeRouter }
    ]
  })));

  beforeEach(() => {
    fakeRouter.navigate.calls.reset();
  });

  it('should have a model field', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a field model
    const componentInstance = fixture.componentInstance;
    expect(componentInstance.model).toEqual({oldPassword: '', newPassword: ''});
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a title
    const element = fixture.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('Changement de mot de passe');
  });

  it('should have a disabled button if the form is incomplete', async(() => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a disabled button
    const element = fixture.nativeElement;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(element.querySelector('button').hasAttribute('disabled')).toBe(true);
    });
  }));

  it('should be possible to change password if the form is complete', async(() => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    fixture.detectChanges();

    const element = fixture.nativeElement;

    fixture.whenStable().then(() => {
      const oldPasswordInput = element.querySelector('input[name="oldPassword"]');
      expect(oldPasswordInput).not.toBeNull();
      oldPasswordInput.value = 'old';
      oldPasswordInput.dispatchEvent(new Event('input'));
      const newPasswordInput = element.querySelector('input[name="newPassword"]');
      expect(newPasswordInput).not.toBeNull();
      newPasswordInput.value = 'new';
      newPasswordInput.dispatchEvent(new Event('input'));

      // when we trigger the change detection
      fixture.detectChanges();

      // then we should have a submit button enabled
      expect(element.querySelector('button').hasAttribute('disabled')).toBe(false);
    });
  }));

  it('should check the old password and change it via the user service and redirect if success', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    fixture.detectChanges();

    const userService = TestBed.get(UserService);
    spyOn(userService, 'checkPassword').and.returnValue(Observable.of(null));
    spyOn(userService, 'changePassword').and.returnValue(Observable.of(null));

    const componentInstance = fixture.componentInstance;
    componentInstance.model.oldPassword = 'old';
    componentInstance.model.newPassword = 'new';

    componentInstance.changePassword();

    // then we should have called the user service methods
    expect(userService.checkPassword).toHaveBeenCalledWith('old');

    expect(userService.changePassword).toHaveBeenCalledWith('new');

    // and redirect to the home
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call the user service and display a message if check password fails', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    fixture.detectChanges();

    const userService = TestBed.get(UserService);
    spyOn(userService, 'checkPassword').and.returnValue(Observable.throw(null));
    spyOn(userService, 'changePassword');

    const componentInstance = fixture.componentInstance;
    componentInstance.model.oldPassword = 'old';
    componentInstance.model.newPassword = 'new';

    componentInstance.changePassword();

    // then we should have called the user service methods
    expect(userService.checkPassword).toHaveBeenCalledWith('old');

    expect(userService.changePassword).not.toHaveBeenCalled();
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
    expect(componentInstance.passwordChangeFailed).toBe(true);
  });

  it('should call the user service and display a message if change password fails', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    fixture.detectChanges();

    const userService = TestBed.get(UserService);
    spyOn(userService, 'checkPassword').and.returnValue(Observable.of(null));
    spyOn(userService, 'changePassword').and.returnValue(Observable.throw(null));

    const componentInstance = fixture.componentInstance;
    componentInstance.model.oldPassword = 'old';
    componentInstance.model.newPassword = 'new';

    componentInstance.changePassword();

    // then we should have called the user service methods
    expect(userService.checkPassword).toHaveBeenCalledWith('old');
    expect(userService.changePassword).toHaveBeenCalledWith('new');

    expect(fakeRouter.navigate).not.toHaveBeenCalled();
    expect(componentInstance.passwordChangeFailed).toBe(true);
  });

  it('should display a message if change failed', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);
    const componentInstance = fixture.componentInstance;
    componentInstance.passwordChangeFailed = true;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.querySelector('.alert')).not.toBeNull();
    expect(element.querySelector('.alert').textContent).toContain('Le mot de passe n\'a pas été modifié.');
  });
});
