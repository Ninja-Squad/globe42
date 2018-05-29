import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PasswordChangeComponent } from './password-change.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentTester, speculoosMatchers } from 'ngx-speculoos';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

class PasswordChangeComponentTester extends ComponentTester<PasswordChangeComponent> {

  constructor() {
    super(PasswordChangeComponent);
  }

  get title() {
    return this.element('h1');
  }

  get oldPassword() {
    return this.input('#oldPassword');
  }

  get newPassword() {
    return this.input('#newPassword');
  }

  get submit() {
    return this.button('#submit');
  }
}

describe('PasswordChangeComponent', () => {

  let tester: PasswordChangeComponentTester;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), HttpClientModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [PasswordChangeComponent, ValidationErrorsComponent],
    });

    tester = new PasswordChangeComponentTester();
    tester.detectChanges();

    jasmine.addMatchers(speculoosMatchers);
  }));

  it('should have a form', () => {
    expect(tester.componentInstance.passwordChangeForm.value).toEqual({oldPassword: '', newPassword: ''});
  });

  it('should have a title', () => {
    expect(tester.title).toContainText('Changement de mot de passe');
  });

  it('should validate the form', () => {
    expect(tester.testElement).not.toContainText('Le mot de passe actuel est obligatoire');
    expect(tester.testElement).not.toContainText('Le nouveau mot de passe est obligatoire');

    tester.submit.click();

    expect(tester.testElement).toContainText('Le mot de passe actuel est obligatoire');
    expect(tester.testElement).toContainText('Le nouveau mot de passe est obligatoire');
  });

  it('should check the old password and change it via the user service and redirect if success', () => {
    const userService = TestBed.get(CurrentUserService);
    spyOn(userService, 'checkPassword').and.returnValue(of(null));
    spyOn(userService, 'changePassword').and.returnValue(of(null));

    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    tester.oldPassword.fillWith('old');
    tester.newPassword.fillWith('new');

    tester.submit.click();

    expect(userService.checkPassword).toHaveBeenCalledWith('old');
    expect(userService.changePassword).toHaveBeenCalledWith('new');

    // and redirect to the home
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call the user service and display a message if check password fails', () => {
    const userService = TestBed.get(CurrentUserService);
    spyOn(userService, 'checkPassword').and.returnValue(throwError(null));
    spyOn(userService, 'changePassword');

    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    tester.oldPassword.fillWith('old');
    tester.newPassword.fillWith('new');

    tester.submit.click();

    expect(userService.checkPassword).toHaveBeenCalledWith('old');
    expect(userService.changePassword).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(tester.testElement).toContainText('Le mot de passe n\'a pas été modifié.');
  });

  it('should call the user service and display a message if change password fails', () => {
    const userService = TestBed.get(CurrentUserService);
    spyOn(userService, 'checkPassword').and.returnValue(of(null));
    spyOn(userService, 'changePassword').and.returnValue(throwError(null));

    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    tester.oldPassword.fillWith('old');
    tester.newPassword.fillWith('new');

    tester.submit.click();

    expect(userService.checkPassword).toHaveBeenCalledWith('old');
    expect(userService.changePassword).toHaveBeenCalledWith('new');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(tester.testElement).toContainText('Le mot de passe n\'a pas été modifié.');
  });
});
