import { async, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrentUserService } from '../current-user/current-user.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
    declarations: [LoginComponent],
  })));

  it('should have a login form', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a field credentials
    const componentInstance = fixture.componentInstance;
    expect(componentInstance.loginForm.value).toEqual({
      login: '',
      password: ''
    });
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a title
    const element = fixture.nativeElement;
    expect(element.querySelector('h1').textContent).toContain('Connexion');
  });

  it('should validate the form', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const currentUserService: CurrentUserService = TestBed.get(CurrentUserService);
    const router: Router = TestBed.get(Router);
    spyOn(currentUserService, 'authenticate');
    spyOn(router, 'navigate');

    const element: HTMLElement = fixture.nativeElement;

    const loginButton: HTMLButtonElement = element.querySelector('#submit');
    loginButton.click();
    fixture.detectChanges();

    expect(element.textContent).toContain(`L'identifiant est obligatoire`);
    expect(element.textContent).toContain(`Le mot de passe est obligatoire`);

    expect(currentUserService.authenticate).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call the user service and redirect if success', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const currentUserService: CurrentUserService = TestBed.get(CurrentUserService);
    const router: Router = TestBed.get(Router);

    const subject = new Subject<String>();
    spyOn(currentUserService, 'authenticate').and.returnValue(subject);
    spyOn(router, 'navigate');

    const element: HTMLElement = fixture.nativeElement;

    const login: HTMLInputElement = element.querySelector('#login');
    login.value = 'login';
    login.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const password: HTMLInputElement = element.querySelector('#password');
    password.value = 'password';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const loginButton: HTMLButtonElement = element.querySelector('#submit');
    loginButton.click();
    fixture.detectChanges();

    // then we should have called the user service method
    expect(currentUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.next('');
    fixture.detectChanges();

    // and redirect to the home
    expect(fixture.componentInstance.authenticationFailed).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call the user service and display a message if failed', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const currentUserService: CurrentUserService = TestBed.get(CurrentUserService);
    const router: Router = TestBed.get(Router);

    const subject = new Subject<String>();
    spyOn(currentUserService, 'authenticate').and.returnValue(subject);
    spyOn(router, 'navigate');

    const element: HTMLElement = fixture.nativeElement;

    const login: HTMLInputElement = element.querySelector('#login');
    login.value = 'login';
    login.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const password: HTMLInputElement = element.querySelector('#password');
    password.value = 'password';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const loginButton: HTMLButtonElement = element.querySelector('#submit');
    loginButton.click();
    fixture.detectChanges();

    // then we should have called the user service method
    expect(currentUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.error(new Error());
    fixture.detectChanges();

    // and not redirect to the home
    expect(router.navigate).not.toHaveBeenCalled();

    expect(element.textContent).toContain(`Erreur d'authentification, essayez encore.`);
  });
});
