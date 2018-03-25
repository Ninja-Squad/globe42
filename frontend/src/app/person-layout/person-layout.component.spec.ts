import { async, TestBed } from '@angular/core/testing';

import { PersonLayoutComponent } from './person-layout.component';
import { PersonModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FullnamePipe } from '../fullname.pipe';
import { of } from 'rxjs/observable/of';

describe('PersonLayoutComponent', () => {
  const person = {
    id: 42,
    firstName: 'John',
    lastName: 'Doe',
    nickName: 'john',
    mediationEnabled: true
  } as PersonModel;

  const activatedRoute = {
    data: of({ person }),
    snapshot: {}
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [PersonLayoutComponent, FullnamePipe],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  })));

  it('should display the person full name as title', () => {
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const name = nativeElement.querySelector('h1#fullName');
    expect(name.textContent).toContain('John Doe (john)');
  });

  it('should have 7 nav links and a router outlet', () => {
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const links = nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(7);

    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });

  it('should only have 4 nav links if mediation is not enabled', () => {
    person.mediationEnabled = false;
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const links = nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(4);
  });
});
