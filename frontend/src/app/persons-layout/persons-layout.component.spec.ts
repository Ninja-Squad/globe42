import { async, TestBed } from '@angular/core/testing';

import { PersonsLayoutComponent } from './persons-layout.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { PageTitleDirective } from '../page-title.directive';

describe('PersonsLayoutComponent', () => {
  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [PersonsLayoutComponent, PageTitleDirective]
  })));

  it('should have a title, pills and a router outlet', () => {
    const fixture = TestBed.createComponent(PersonsLayoutComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Adhérents');
    const links = fixture.nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(3);

    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
