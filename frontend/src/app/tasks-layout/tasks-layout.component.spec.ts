import { TestBed } from '@angular/core/testing';

import { TasksLayoutComponent } from './tasks-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { ComponentTester } from 'ngx-speculoos';

class TasksLayoutComponentTester extends ComponentTester<TasksLayoutComponent> {
  constructor() {
    super(TasksLayoutComponent);
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

describe('TasksLayoutComponent', () => {
  let tester: TasksLayoutComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TasksLayoutComponent]
    });
    tester = new TasksLayoutComponentTester();
    tester.detectChanges();
  });

  it('should have a title, pills and a router outlet', () => {
    expect(tester.title).toHaveText('Tâches');
    expect(tester.links.length).toBe(6);
    expect(tester.routerOutlet).toBeTruthy();
  });
});
