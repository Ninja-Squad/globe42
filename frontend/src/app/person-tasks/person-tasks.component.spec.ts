import { TestBed } from '@angular/core/testing';

import { PersonTasksComponent } from './person-tasks.component';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentTester } from 'ngx-speculoos';

class PersonTasksComponentTester extends ComponentTester<PersonTasksComponent> {
  constructor() {
    super(PersonTasksComponent);
  }

  get links() {
    return this.elements('a.nav-link');
  }

  get routerOutlet() {
    return this.element(RouterOutlet);
  }
}

describe('PersonTasksComponent', () => {
  let tester: PersonTasksComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PersonTasksComponent]
    });

    tester = new PersonTasksComponentTester();
    tester.detectChanges();
  });

  it('should have 2 tabs and a router outlet', () => {
    expect(tester.links.length).toBe(2);
    expect(tester.routerOutlet).toBeTruthy();
  });
});
