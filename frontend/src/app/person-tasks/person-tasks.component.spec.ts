import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonTasksComponent } from './person-tasks.component';
import { PersonModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('PersonTasksComponent', () => {
  const activatedRoute = {
    parent: {
      snapshot: {
        data: {
          person: {
            id: 42,
            nickName: 'JB'
          }
        }
      }
    }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [PersonTasksComponent],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute }
    ]
  })));

  it('should have a router-outlet to display the task page as a child component', () => {
    const fixture = TestBed.createComponent(PersonTasksComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(RouterOutlet))).toBeTruthy();
  });

  it('should display a link allowing to add a task for the person', () => {
    const fixture = TestBed.createComponent(PersonTasksComponent);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/tasks/create;concerned-person=42');
  });
});
