import { async, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../models/user.model';

describe('UsersComponent', () => {
  const users: Array<UserModel> = [
    { id: 42, login: 'jb', admin: false },
    { id: 43, login: 'ced', admin: true }
  ];
  const activatedRoute = {
    snapshot: { data: { users } }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [UsersComponent],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  })));

  it('should expose sorted users', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.users.map(u => u.login)).toEqual(['ced', 'jb']);
  });

  it('should list users', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const types = nativeElement.querySelectorAll('div.user-item');
    expect(types.length).toBe(2);
  });
});
