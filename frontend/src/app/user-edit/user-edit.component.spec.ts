import { async, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { of } from 'rxjs';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { UserWithPasswordModel } from '../models/user-with-password.model';

describe('UserEditComponent', () => {

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, GlobeNgbModule.forRoot(), ValdemortModule],
    declarations: [UserEditComponent, ValidationDefaultsComponent, PageTitleDirective]
  })
  class TestModule {}

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: {} }
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    }));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvel utilisateur');
    });

    it('should expose no created user, and a default user', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.createdUser).toBeUndefined();
      expect(component.userForm.value).toEqual({ login: '', admin: false });
    });

    it('should display the user in a form, and validate the form', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const login: HTMLInputElement = element.querySelector('#login');
      expect(login.value).toBe('');

      const noAdmin: HTMLInputElement = element.querySelector('#role-no-admin');
      expect(noAdmin.checked).toBe(true);

      const admin: HTMLInputElement = element.querySelector('#role-admin');
      expect(admin.checked).toBe(false);

      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();
      fixture.detectChanges();

      expect(element.textContent).toContain(`L'identifiant est obligatoire`);

      const createdUser = element.querySelector('#created-user');
      expect(createdUser).toBeNull();
    });

    it('should save the user and display the result', () => {
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'create').and.returnValue(of({
        login: 'foo',
        generatedPassword: 'passw0rd'
      } as UserWithPasswordModel));

      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const login: HTMLInputElement = element.querySelector('#login');
      login.value = 'foo';
      login.dispatchEvent(new Event('input'));

      const admin: HTMLInputElement = element.querySelector('#role-admin');
      admin.click();
      fixture.detectChanges();

      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();
      fixture.detectChanges();

      expect(userService.create).toHaveBeenCalledWith({ login: 'foo', admin: true });

      const createdUser = element.querySelector('#created-user');
      expect(createdUser).not.toBeNull();
      expect(createdUser.textContent).toContain('foo');
      expect(createdUser.textContent).toContain('passw0rd');
    });
  });

  describe('in edition mode', () => {
    const user: UserModel = {
      id: 42,
      login: 'jb',
      admin: true
    };
    const activatedRoute = {
      snapshot: { data: { user } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification de l\'utilisateur jb');
    });

    it('should expose no created user, and the edited user info', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.createdUser).toBeUndefined();
      expect(component.userForm.value).toEqual({ login: 'jb', admin: true });
    });

    it('should display the user in a form, and have the save button enabled', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const login: HTMLInputElement = element.querySelector('#login');
      expect(login.value).toBe('jb');

      const noAdmin: HTMLInputElement = element.querySelector('#role-no-admin');
      expect(noAdmin.checked).toBe(false);

      const admin: HTMLInputElement = element.querySelector('#role-admin');
      expect(admin.checked).toBe(true);

      const createdUser = element.querySelector('#created-user');
      expect(createdUser).toBeNull();
    });

    it('should save the user and navigate to the users page', () => {
      const userService = TestBed.inject(UserService);
      const router = TestBed.inject(Router);

      spyOn(userService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();
      fixture.detectChanges();

      expect(userService.update).toHaveBeenCalledWith(42, { login: 'jb', admin: true });
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });
  });
});
