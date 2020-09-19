import { TestBed } from '@angular/core/testing';

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
import { ComponentTester } from 'ngx-speculoos';

class UserEditComponentTester extends ComponentTester<UserEditComponent> {
  constructor() {
    super(UserEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get login() {
    return this.input('#login');
  }

  get roleNoAdmin() {
    return this.input('#role-no-admin');
  }

  get roleAdmin() {
    return this.input('#role-admin');
  }

  get save() {
    return this.button('#save');
  }

  get createdUser() {
    return this.element('#created-user');
  }
}

describe('UserEditComponent', () => {
  @NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterTestingModule,
      GlobeNgbModule.forRoot(),
      ValdemortModule
    ],
    declarations: [UserEditComponent, ValidationDefaultsComponent, PageTitleDirective]
  })
  class TestModule {}

  let tester: UserEditComponentTester;

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: {} }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
      tester = new UserEditComponentTester();
      tester.detectChanges();
    });

    it('should have a title', () => {
      expect(tester.title).toContainText('Nouvel utilisateur');
    });

    it('should expose no created user, and a default user', () => {
      expect(tester.componentInstance.createdUser).toBeUndefined();
      expect(tester.componentInstance.userForm.value).toEqual({ login: '', admin: false });
    });

    it('should display the user in a form, and validate the form', () => {
      expect(tester.login).toHaveValue('');
      expect(tester.roleNoAdmin).toBeChecked();
      expect(tester.roleAdmin).not.toBeChecked();

      tester.save.click();

      expect(tester.testElement).toContainText(`L'identifiant est obligatoire`);

      expect(tester.createdUser).toBeNull();
    });

    it('should save the user and display the result', () => {
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'create').and.returnValue(
        of({
          login: 'foo',
          generatedPassword: 'passw0rd'
        } as UserWithPasswordModel)
      );

      tester.login.fillWith('foo');
      tester.roleAdmin.check();
      tester.save.click();

      expect(userService.create).toHaveBeenCalledWith({ login: 'foo', admin: true });

      expect(tester.createdUser).not.toBeNull();
      expect(tester.createdUser).toContainText('foo');
      expect(tester.createdUser).toContainText('passw0rd');
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      tester = new UserEditComponentTester();
      tester.detectChanges();
    });

    it('should have a title', () => {
      expect(tester.title).toContainText(`Modification de l'utilisateur jb`);
    });

    it('should expose no created user, and the edited user info', () => {
      expect(tester.componentInstance.createdUser).toBeUndefined();
      expect(tester.componentInstance.userForm.value).toEqual({ login: 'jb', admin: true });
    });

    it('should display the user in a form, and have the save button enabled', () => {
      expect(tester.login).toHaveValue('jb');
      expect(tester.roleNoAdmin).not.toBeChecked();
      expect(tester.roleAdmin).toBeChecked();
      expect(tester.createdUser).toBeNull();
    });

    it('should save the user and navigate to the users page', () => {
      const userService = TestBed.inject(UserService);
      const router = TestBed.inject(Router);

      spyOn(userService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      tester.save.click();

      expect(userService.update).toHaveBeenCalledWith(42, { login: 'jb', admin: true });
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });
  });
});
