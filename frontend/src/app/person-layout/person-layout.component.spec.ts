import { async, TestBed } from '@angular/core/testing';

import { PersonLayoutComponent } from './person-layout.component';
import { PersonModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FullnamePipe } from '../fullname.pipe';

describe('PersonLayoutComponent', () => {
  const person: PersonModel = {
    id: 42,
    firstName: 'John',
    lastName: 'Doe',
    nickName: 'john'
  } as PersonModel;

  const activatedRoute = {
    snapshot: { data: { person } }
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

  it('should have 3 nav links and a router outlet', () => {
    const fixture = TestBed.createComponent(PersonLayoutComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const links = nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(3);

    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
