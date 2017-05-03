import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { UsersComponent } from './users.component';
import { AppModule } from '../app.module';

describe('UsersComponent', () => {
  const activatedRoute = {
    snapshot: { data: { users: [{ firstName: 'John', lastName: 'Doe' }] } }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should list users', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const users = nativeElement.querySelectorAll('div.list-group-item');
    expect(users.length).toBe(1);
  });
});
