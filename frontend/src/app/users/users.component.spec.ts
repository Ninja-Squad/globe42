import { async, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { ConfirmService } from '../confirm.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { PageTitleDirective } from '../page-title.directive';

describe('UsersComponent', () => {
  const users: Array<UserModel> = [
    { id: 42, login: 'jb', admin: false },
    { id: 43, login: 'ced', admin: true }
  ];
  const activatedRoute = {
    snapshot: { data: { users } }
  };

  let currentUserService: CurrentUserService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), RouterTestingModule, HttpClientModule, NgbModalModule],
      declarations: [UsersComponent, PageTitleDirective],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });

    userService = TestBed.get(UserService);
    currentUserService = TestBed.get(CurrentUserService);
    currentUserService.userEvents = new BehaviorSubject<UserModel>({ id: 42 } as UserModel);
  }));

  it('should expose sorted users', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.users.map(u => u.login)).toEqual(['ced', 'jb']);
  });

  it('should list users', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const userElements = nativeElement.querySelectorAll('div.user-item');
    expect(userElements.length).toBe(2);
  });

  it('should disable the delete button of the current user', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const userElements = nativeElement.querySelectorAll('div.user-item');

    expect(userElements[0].querySelector('.delete-button').disabled).toBe(false);
    expect(userElements[1].querySelector('.delete-button').disabled).toBe(true);
  });

  it('should confirm before deleting a user', () => {
    const confirmService = TestBed.get(ConfirmService);

    spyOn(userService, 'delete');
    spyOn(confirmService, 'confirm').and.returnValue(throwError('nope'));

    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    fixture.componentInstance.delete(users[1]);

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(userService.delete).not.toHaveBeenCalled();
  });

  it('should delete after confirmation', () => {
    const confirmService = TestBed.get(ConfirmService);

    spyOn(userService, 'delete').and.returnValue(of(null));
    spyOn(userService, 'list').and.returnValue(of(users));
    spyOn(confirmService, 'confirm').and.returnValue(of('ok'));

    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    const originalUsers = fixture.componentInstance.users;

    fixture.componentInstance.delete(users[1]);

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(userService.delete).toHaveBeenCalledWith(users[1].id);
    expect(fixture.componentInstance.users).not.toBe(originalUsers);
    expect(fixture.componentInstance.users.map(u => u.login)).toEqual(['ced', 'jb']);
  });

  it('should say if a user is the current user', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    expect(fixture.componentInstance.isCurrentUser(users[0])).toBeTruthy();
    expect(fixture.componentInstance.isCurrentUser(users[1])).toBeFalsy();
  });
});
