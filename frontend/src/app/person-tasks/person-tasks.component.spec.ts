import { async, TestBed } from '@angular/core/testing';

import { PersonTasksComponent } from './person-tasks.component';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonTasksComponent', () => {
  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PersonTasksComponent]
    })));

  it('should have 2 tabs and a router outlet', () => {
    const fixture = TestBed.createComponent(PersonTasksComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const links = nativeElement.querySelectorAll('a.nav-link');
    expect(links.length).toBe(2);

    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
