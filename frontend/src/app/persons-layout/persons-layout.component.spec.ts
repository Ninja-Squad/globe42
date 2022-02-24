import { TestBed } from '@angular/core/testing';

import { PersonsLayoutComponent } from './persons-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class PersonsLayoutComponentTester extends ComponentTester<PersonsLayoutComponent> {
  constructor() {
    super(PersonsLayoutComponent);
  }

  get title() {
    return this.element('h1');
  }

  get links() {
    return this.elements('a.nav-link');
  }

  get routerOutlet() {
    return this.element(RouterOutlet);
  }
}

describe('PersonsLayoutComponent', () => {
  let tester: PersonsLayoutComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PersonsLayoutComponent, PageTitleDirective]
    });

    tester = new PersonsLayoutComponentTester();
    tester.detectChanges();
  });

  it('should have a title, pills and a router outlet', () => {
    expect(tester.title).toHaveText('Adhérents');
    expect(tester.links.length).toBe(6);
    expect(tester.routerOutlet).toBeTruthy();
  });
});
