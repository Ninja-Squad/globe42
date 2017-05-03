import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserEditComponent } from './user-edit.component';
import { AppModule } from '../app.module';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('UserEditComponent', () => {

  describe('in edit mode', () => {
    const user: UserModel = { id: 0, firstName: 'John', lastName: 'Doe' };
    const activatedRoute = {
      snapshot: { data: { user } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

    it('should edit and update an existing user', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'update').and.returnValue(Observable.of(user));
      const router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const firstName = nativeElement.querySelector('#firstname');
      expect(firstName.value).toBe('John');
      const lastName = nativeElement.querySelector('#lastname');
      expect(lastName.value).toBe('Doe');

      lastName.value = 'Do';
      lastName.dispatchEvent(new Event('input'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(userService.update).toHaveBeenCalled();

      const userUpdated = userService.update.calls.argsFor(0)[0];
      expect(userUpdated.id).toBe(0);
      expect(userUpdated.lastName).toBe('Do');
      expect(userUpdated.firstName).toBe('John');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/users');
    });

  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: { user: null } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

    it('should create and save a new user', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'create').and.returnValue(Observable.of(null));
      const router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');
      const fixture = TestBed.createComponent(UserEditComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      const firstName = nativeElement.querySelector('#firstname');
      expect(firstName.value).toBe('');
      const lastName = nativeElement.querySelector('#lastname');
      expect(lastName.value).toBe('');

      lastName.value = 'Doe';
      lastName.dispatchEvent(new Event('input'));
      firstName.value = 'Jane';
      firstName.dispatchEvent(new Event('input'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(userService.create).toHaveBeenCalled();

      const userUpdated = userService.create.calls.argsFor(0)[0];
      expect(userUpdated.id).toBeUndefined();
      expect(userUpdated.lastName).toBe('Doe');
      expect(userUpdated.firstName).toBe('Jane');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/users');
    });
  });
});
