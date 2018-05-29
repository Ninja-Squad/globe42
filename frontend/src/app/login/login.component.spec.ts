import { async, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrentUserService } from '../current-user/current-user.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentTester, speculoosMatchers } from 'ngx-speculoos';
import { FormControlValidationDirective } from '../form-control-validation.directive';

class LoginComponentTester extends ComponentTester<LoginComponent> {

  constructor() {
    super(LoginComponent);
  }

  get title() {
    return this.element('h1');
  }

  get login() {
    return this.input('#login');
  }

  get password() {
    return this.input('#password');
  }

  get submit() {
    return this.button('#submit');
  }
}

describe('LoginComponent', () => {

  let tester: LoginComponentTester;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [LoginComponent, FormControlValidationDirective],
    });

    jasmine.addMatchers(speculoosMatchers);

    tester = new LoginComponentTester();
    tester.detectChanges();
  }));

  it('should have a login form', () => {
    expect(tester.componentInstance.loginForm.value).toEqual({
      login: '',
      password: ''
    });
  });

  it('should have a title', () => {
    expect(tester.title).toContainText('Connexion');
  });

  it('should validate the form', () => {
    const currentUserService: CurrentUserService = TestBed.get(CurrentUserService);
    const router: Router = TestBed.get(Router);
    spyOn(currentUserService, 'authenticate');
    spyOn(router, 'navigate');

    tester.submit.click();

    expect(tester.testElement).toContainText(`L'identifiant est obligatoire`);
    expect(tester.testElement).toContainText(`Le mot de passe est obligatoire`);

    expect(currentUserService.authenticate).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call the user service and redirect if success', () => {
    const currentUserService: CurrentUserService = TestBed.get(CurrentUserService);
    const router: Router = TestBed.get(Router);

    const subject = new Subject<String>();
    spyOn(currentUserService, 'authenticate').and.returnValue(subject);
    spyOn(router, 'navigate');

    tester.login.fillWith('login');
    tester.password.fillWith('password');
    tester.submit.click();

    // then we should have called the user service method
    expect(currentUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.next('');
    tester.detectChanges();

    // and redirect to the home
    expect(tester.componentInstance.authenticationFailed).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call the user service and display a message if failed', () => {
    const currentUserService: CurrentUserService = TestBed.get(CurrentUserService);
    const router: Router = TestBed.get(Router);

    const subject = new Subject<String>();
    spyOn(currentUserService, 'authenticate').and.returnValue(subject);
    spyOn(router, 'navigate');

    tester.login.fillWith('login');
    tester.password.fillWith('password');
    tester.submit.click();

    // then we should have called the user service method
    expect(currentUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.error(new Error());
    tester.detectChanges();

    // and not redirect to the home
    expect(router.navigate).not.toHaveBeenCalled();

    expect(tester.testElement).toContainText(`Erreur d'authentification, essayez encore.`);
  });
});
