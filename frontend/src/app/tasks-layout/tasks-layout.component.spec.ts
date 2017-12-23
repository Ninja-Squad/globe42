import { async, TestBed } from '@angular/core/testing';

import { TasksLayoutComponent } from './tasks-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe('TasksLayoutComponent', () => {

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [TasksLayoutComponent]
  })));

  it('should have a title, pills and a router outlet', () => {
    const fixture = TestBed.createComponent(TasksLayoutComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Tâches');
    const links = fixture.nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(7);

    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
