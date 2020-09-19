import { TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { ConfirmService } from '../confirm.service';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class UsersComponentTester extends ComponentTester<UsersComponent> {
  constructor() {
    super(UsersComponent);
  }

  get userItems() {
    return this.elements('.user-item');
  }

  get deleteButtons() {
    return this.elements<HTMLButtonElement>('.user-item .delete-button');
  }
}

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
  let tester: UsersComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), RouterTestingModule, HttpClientModule, NgbModalModule],
      declarations: [UsersComponent, PageTitleDirective],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });

    userService = TestBed.inject(UserService);
    currentUserService = TestBed.inject(CurrentUserService);
    currentUserService.userEvents = new BehaviorSubject<UserModel>({ id: 42 } as UserModel);

    tester = new UsersComponentTester();
    tester.detectChanges();
  });

  it('should expose sorted users', () => {
    expect(tester.componentInstance.users.map(u => u.login)).toEqual(['ced', 'jb']);
  });

  it('should list users', () => {
    expect(tester.userItems.length).toBe(2);
  });

  it('should disable the delete button of the current user', () => {
    expect(tester.deleteButtons[0].disabled).toBe(false);
    expect(tester.deleteButtons[1].disabled).toBe(true);
  });

  it('should confirm before deleting a user', () => {
    const confirmService = TestBed.inject(ConfirmService);

    spyOn(userService, 'delete');
    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);

    tester.componentInstance.delete(users[1]);

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(userService.delete).not.toHaveBeenCalled();
  });

  it('should delete after confirmation', () => {
    const confirmService = TestBed.inject(ConfirmService);

    spyOn(userService, 'delete').and.returnValue(of(null));
    spyOn(userService, 'list').and.returnValue(of(users));
    spyOn(confirmService, 'confirm').and.returnValue(of(null));

    const originalUsers = tester.componentInstance.users;

    tester.componentInstance.delete(users[1]);

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(userService.delete).toHaveBeenCalledWith(users[1].id);
    expect(tester.componentInstance.users).not.toBe(originalUsers);
    expect(tester.componentInstance.users.map(u => u.login)).toEqual(['ced', 'jb']);
  });

  it('should say if a user is the current user', () => {
    expect(tester.componentInstance.isCurrentUser(users[0])).toBeTruthy();
    expect(tester.componentInstance.isCurrentUser(users[1])).toBeFalsy();
  });
});
