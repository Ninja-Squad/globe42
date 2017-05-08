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
    const user: UserModel = {
      id: 0, firstName: 'John', lastName: 'Doe', surName: 'john', birthDate: '1980-01-01',
      mediationCode: 'code1', address: 'Chemin de la gare', zipCode: 42000,
      city: 'Saint Etienne', email: 'john@mail.com', isAdherent: true, entryDate: '2016-12-01'
    };
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
      const firstName = nativeElement.querySelector('#firstName');
      expect(firstName.value).toBe(user.firstName);
      const lastName = nativeElement.querySelector('#lastName');
      expect(lastName.value).toBe(user.lastName);
      const surName = nativeElement.querySelector('#surName');
      expect(surName.value).toBe(user.surName);
      const birthDate = nativeElement.querySelector('#birthDate');
      expect(birthDate.value).toBe(user.birthDate);
      const mediationCode = nativeElement.querySelector('#mediationCode');
      expect(mediationCode.value).toBe(user.mediationCode);
      const address = nativeElement.querySelector('#address');
      expect(address.value).toBe(user.address);
      const zipCode = nativeElement.querySelector('#zipCode');
      expect(+zipCode.value).toBe(user.zipCode);
      const city = nativeElement.querySelector('#city');
      expect(city.value).toBe(user.city);
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe(user.email);
      const isAdherentYes = nativeElement.querySelector('#isAdherentYes');
      expect(isAdherentYes.checked).toBe(true);
      const isAdherentNo = nativeElement.querySelector('#isAdherentNo');
      expect(isAdherentNo.checked).toBe(false);
      const entryDate = nativeElement.querySelector('#entryDate');
      expect(entryDate.value).toBe(user.entryDate);

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
      const firstName = nativeElement.querySelector('#firstName');
      expect(firstName.value).toBe('');
      const lastName = nativeElement.querySelector('#lastName');
      expect(lastName.value).toBe('');
      const surName = nativeElement.querySelector('#surName');
      expect(surName.value).toBe('');
      const birthDate = nativeElement.querySelector('#birthDate');
      expect(birthDate.value).toBe('');
      const mediationCode = nativeElement.querySelector('#mediationCode');
      expect(mediationCode.value).toBe('');
      const address = nativeElement.querySelector('#address');
      expect(address.value).toBe('');
      const zipCode = nativeElement.querySelector('#zipCode');
      expect(+zipCode.value).toBe(0);
      const city = nativeElement.querySelector('#city');
      expect(city.value).toBe('');
      const email = nativeElement.querySelector('#email');
      expect(email.value).toBe('');
      const isAdherentYes = nativeElement.querySelector('#isAdherentYes');
      expect(isAdherentYes.checked).toBe(false);
      const isAdherentNo = nativeElement.querySelector('#isAdherentNo');
      expect(isAdherentNo.checked).toBe(false);
      const entryDate = nativeElement.querySelector('#entryDate');
      expect(entryDate.value).toBe('');

      lastName.value = 'Doe';
      lastName.dispatchEvent(new Event('input'));
      firstName.value = 'Jane';
      firstName.dispatchEvent(new Event('input'));
      surName.value = 'jane';
      surName.dispatchEvent(new Event('input'));
      birthDate.value = '1985-03-03';
      birthDate.dispatchEvent(new Event('change'));
      mediationCode.value = 'code2';
      mediationCode.dispatchEvent(new Event('input'));
      address.value = 'Avenue Liberté';
      address.dispatchEvent(new Event('input'));
      zipCode.value = '69007';
      zipCode.dispatchEvent(new Event('input'));
      city.value = 'Lyon';
      city.dispatchEvent(new Event('input'));
      email.value = 'jane@mail.com';
      email.dispatchEvent(new Event('input'));
      isAdherentYes.checked = true;
      isAdherentYes.dispatchEvent(new Event('change'));
      entryDate.value = '2015-02-02';
      entryDate.dispatchEvent(new Event('change'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(entryDate.value).toBe('2015-02-02');

      expect(userService.create).toHaveBeenCalled();

      const userUpdated = userService.create.calls.argsFor(0)[0] as UserModel;
      expect(userUpdated.id).toBeUndefined();
      expect(userUpdated.lastName).toBe('Doe');
      expect(userUpdated.firstName).toBe('Jane');
      expect(userUpdated.surName).toBe('jane');
      expect(userUpdated.birthDate).toBe('1985-03-03');
      expect(userUpdated.mediationCode).toBe('code2');
      expect(userUpdated.address).toBe('Avenue Liberté');
      expect(userUpdated.zipCode).toBe(69007);
      expect(userUpdated.city).toBe('Lyon');
      expect(userUpdated.email).toBe('jane@mail.com');
      expect(userUpdated.isAdherent).toBe(true);
      expect(userUpdated.entryDate).toBe('2015-02-02');

      expect(router.navigateByUrl).toHaveBeenCalledWith('/users');
    });
  });
});
