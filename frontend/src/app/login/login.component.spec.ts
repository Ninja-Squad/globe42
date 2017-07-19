import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { LoginComponent } from './login.component';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {

  const fakeRouter = jasmine.createSpyObj('Router', ['navigate']);
  const fakeUserService = jasmine.createSpyObj('UserService', ['authenticate']);

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [FormsModule],
    declarations: [LoginComponent],
    providers: [
      { provide: UserService, useValue: fakeUserService },
      { provide: Router, useValue: fakeRouter }
    ]
  })));

  beforeEach(() => {
    fakeRouter.navigate.calls.reset();
    fakeUserService.authenticate.calls.reset();
  });

  it('should have a credentials field', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a field credentials
    const componentInstance = fixture.componentInstance;
    expect(componentInstance.credentials).not.toBeNull();
    expect(componentInstance.credentials.login).toBe('');
    expect(componentInstance.credentials.password).toBe('');
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a title
    const element = fixture.nativeElement;
    expect(element.querySelector('h1')).not.toBeNull();
    expect(element.querySelector('h1').textContent).toContain('Connexion');
  });

  it('should have a disabled button if the form is incomplete', async(() => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a disabled button
    const element = fixture.nativeElement;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(element.querySelector('button')).not.toBeNull();
      expect(element.querySelector('button').hasAttribute('disabled')).toBe(true);
    });
  }));

  it('should be possible to log in if the form is complete', async(() => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const element = fixture.nativeElement;

    fixture.whenStable().then(() => {
      const loginInput = element.querySelector('input[name="login"]');
      expect(loginInput).not.toBeNull();
      loginInput.value = 'login';
      loginInput.dispatchEvent(new Event('input'));
      const passwordInput = element.querySelector('input[name="password"]');
      expect(passwordInput).not.toBeNull();
      passwordInput.value = 'password';
      passwordInput.dispatchEvent(new Event('input'));

      // when we trigger the change detection
      fixture.detectChanges();

      // then we should have a submit button enabled
      expect(element.querySelector('button').hasAttribute('disabled')).toBe(false);
    });
  }));

  it('should call the user service and redirect if success', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const subject = new Subject<String>();
    fakeUserService.authenticate.and.returnValue(subject);

    const componentInstance = fixture.componentInstance;
    componentInstance.credentials.login = 'login';
    componentInstance.credentials.password = 'password';

    componentInstance.authenticate();

    // then we should have called the user service method
    expect(fakeUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.next('');
    // and redirect to the home
    expect(componentInstance.authenticationFailed).toBe(false);
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/']);

  });

  it('should call the user service and display a message if failed', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const subject = new Subject<String>();
    fakeUserService.authenticate.and.returnValue(subject);

    const componentInstance = fixture.componentInstance;
    componentInstance.credentials.login = 'login';
    componentInstance.credentials.password = 'password';

    componentInstance.authenticate();

    // then we should have called the user service method
    expect(fakeUserService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.error(new Error());
    // and not redirect to the home
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
    expect(componentInstance.authenticationFailed).toBe(true);
  });

  it('should display a message if auth failed', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const componentInstance = fixture.componentInstance;
    componentInstance.authenticationFailed = true;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.querySelector('.alert')).not.toBeNull();
    expect(element.querySelector('.alert').textContent).toContain('Erreur d\'authentification, essayez encore.');
  });
});
