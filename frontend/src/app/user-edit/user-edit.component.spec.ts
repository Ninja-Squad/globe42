import { async, TestBed } from '@angular/core/testing';

import { UserEditComponent } from './user-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ErrorService } from '../error.service';
import { UserService } from '../user.service';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { of } from 'rxjs/observable/of';

describe('UserEditComponent', () => {

  @NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule, RouterTestingModule, GlobeNgbModule.forRoot()],
    declarations: [UserEditComponent],
    providers: [UserService, ErrorService]
  })
  class TestModule {}

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: {} }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

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
      expect(component.user).toEqual({ login: '', admin: false });
    });

    it('should display the user in a form, and have the save button disabled', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const login = nativeElement.querySelector('#login');
        expect(login.value).toBe('');

        const noAdmin = nativeElement.querySelector('#role-no-admin');
        expect(noAdmin.checked).toBe(true);

        const admin = nativeElement.querySelector('#role-admin');
        expect(admin.checked).toBe(false);

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(true);

        const createdUser = nativeElement.querySelector('#created-user');
        expect(createdUser).toBeNull();
      });
    });

    it('should save the user and display the result', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'create').and.returnValue(of({
        login: 'foo',
        generatedPassword: 'passw0rd'
      }));

      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const login = nativeElement.querySelector('#login');
        login.value = 'foo';
        login.dispatchEvent(new Event('input'));

        const admin = nativeElement.querySelector('#role-admin');
        admin.click();

        const save = nativeElement.querySelector('#save');
        fixture.detectChanges();

        expect(save.disabled).toBe(false);
        save.click();

        expect(userService.create).toHaveBeenCalledWith({ login: 'foo', admin: true });

        fixture.detectChanges();

        const createdUser = nativeElement.querySelector('#created-user');
        expect(createdUser).not.toBeNull();
        expect(createdUser.textContent).toContain('foo');
        expect(createdUser.textContent).toContain('passw0rd');
      });
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
      expect(component.user).toEqual({ login: 'jb', admin: true });
    });

    it('should display the user in a form, and have the save button enabled', () => {
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const login = nativeElement.querySelector('#login');
        expect(login.value).toBe('jb');

        const noAdmin = nativeElement.querySelector('#role-no-admin');
        expect(noAdmin.checked).toBe(false);

        const admin = nativeElement.querySelector('#role-admin');
        expect(admin.checked).toBe(true);

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(false);

        const createdUser = nativeElement.querySelector('#created-user');
        expect(createdUser).toBeNull();
      });
    });

    it('should save the user and navigate to the users page', () => {
      const userService = TestBed.get(UserService);
      const router = TestBed.get(Router);

      spyOn(userService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        const save = nativeElement.querySelector('#save');
        save.click();

        expect(userService.update).toHaveBeenCalledWith(42, { login: 'jb', admin: true });

        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/users']);
      });
    });
  });
});
