import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { UserComponent } from './user.component';
import { AppModule } from '../app.module';

describe('UserComponent', () => {
  const activatedRoute = {
    snapshot: { data: { user: { firstName: 'John', lastName: 'Doe' } } }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should display a user', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const name = nativeElement.querySelector('p.form-control-static');
    expect(name.textContent).toBe('John Doe');
  });
});
