import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasswordChangeComponent } from './password-change.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('PasswordChangeComponent', () => {

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [CurrentUserModule.forRoot(), HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    declarations: [PasswordChangeComponent],
  })));

  it('should have a form', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a field model
    const componentInstance = fixture.componentInstance;
    expect(componentInstance.passwordChangeForm.value).toEqual({oldPassword: '', newPassword: ''});
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a title
    const element = fixture.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('Changement de mot de passe');
  });

  it('should validate the form', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const submitButton: HTMLButtonElement = element.querySelector('#submit');
    submitButton.click();

    expect(element.textContent).toContain('Le mot de passe actuel est obligatoire');
    expect(element.textContent).toContain('Le nouveau mot de passe est obligatoire');
  });

  it('should check the old password and change it via the user service and redirect if success', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);
    fixture.detectChanges();

    const userService = TestBed.get(CurrentUserService);
    spyOn(userService, 'checkPassword').and.returnValue(of(null));
    spyOn(userService, 'changePassword').and.returnValue(of(null));

    const element: HTMLElement = fixture.nativeElement;

    const oldPassword: HTMLInputElement = element.querySelector('#oldPassword');
    oldPassword.value = 'old';
    oldPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const newPassword: HTMLInputElement = element.querySelector('#newPassword');
    newPassword.value = 'new';
    newPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const submitButton: HTMLButtonElement = element.querySelector('#submit');
    submitButton.click();
    fixture.detectChanges();

    expect(userService.checkPassword).toHaveBeenCalledWith('old');
    expect(userService.changePassword).toHaveBeenCalledWith('new');

    // and redirect to the home
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call the user service and display a message if check password fails', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);
    fixture.detectChanges();

    const userService = TestBed.get(CurrentUserService);
    spyOn(userService, 'checkPassword').and.returnValue(throwError(null));
    spyOn(userService, 'changePassword');

    const element: HTMLElement = fixture.nativeElement;

    const oldPassword: HTMLInputElement = element.querySelector('#oldPassword');
    oldPassword.value = 'old';
    oldPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const newPassword: HTMLInputElement = element.querySelector('#newPassword');
    newPassword.value = 'new';
    newPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const submitButton: HTMLButtonElement = element.querySelector('#submit');
    submitButton.click();
    fixture.detectChanges();

    expect(userService.checkPassword).toHaveBeenCalledWith('old');
    expect(userService.changePassword).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Le mot de passe n\'a pas été modifié.');
  });

  it('should call the user service and display a message if change password fails', () => {
    const fixture = TestBed.createComponent(PasswordChangeComponent);
    fixture.detectChanges();

    const userService = TestBed.get(CurrentUserService);
    spyOn(userService, 'checkPassword').and.returnValue(of(null));
    spyOn(userService, 'changePassword').and.returnValue(throwError(null));

    const element: HTMLElement = fixture.nativeElement;

    const oldPassword: HTMLInputElement = element.querySelector('#oldPassword');
    oldPassword.value = 'old';
    oldPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const newPassword: HTMLInputElement = element.querySelector('#newPassword');
    newPassword.value = 'new';
    newPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const submitButton: HTMLButtonElement = element.querySelector('#submit');
    submitButton.click();
    fixture.detectChanges();

    expect(userService.checkPassword).toHaveBeenCalledWith('old');
    expect(userService.changePassword).toHaveBeenCalledWith('new');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Le mot de passe n\'a pas été modifié.');
  });
});
