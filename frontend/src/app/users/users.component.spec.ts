import { TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { AppModule } from '../app.module';
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

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
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
    const types = nativeElement.querySelectorAll('div.user-item');
    expect(types.length).toBe(2);
  });
});
