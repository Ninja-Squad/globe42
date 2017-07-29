import { async, TestBed } from '@angular/core/testing';

import { TasksComponent } from './tasks.component';
import { TaskModel } from '../models/task.model';
import { UserModel } from '../models/user.model';
import { PersonIdentityModel } from '../models/person.model';
import { FullnamePipe } from '../fullname.pipe';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NowService } from '../now.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('TasksComponent', () => {
  let tasks: Array<TaskModel>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    tasks = [
      {
        id: 12,
        description: 'Some description',
        title: 'Some title',
        dueDate: '2017-08-01',
        status: 'TODO',
        assignee: {
          id: 1,
          login: 'admin'
        } as UserModel,
        creator: {
          id: 2,
          login: 'user2'
        } as UserModel,
        concernedPerson: {
          id: 3,
          firstName: 'JB',
          lastName: 'Nizet'
        } as PersonIdentityModel
      }
    ];

    activatedRoute = {
      snapshot: {
        data: {
          tasks
        }
      }
    } as any;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TasksComponent, FullnamePipe],
      providers: [
        NowService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });
    moment.locale('fr');

    spyOn(TestBed.get(NowService), 'now').and.callFake(() => moment('2017-08-01T12:30:00'));
  }));

  it('should wrap and expose tasks in due date order, with  tasks without due date last', () => {
    tasks.push({
      id: 14,
      dueDate: null
    } as any);
    tasks.push({
      id: 13,
      dueDate: '2017-07-31'
    } as any);

    const component = new TasksComponent(activatedRoute, TestBed.get(NowService));
    component.ngOnInit();

    expect(component.tasks.map(task => task.model.id)).toEqual([13, 12, 14]);
    expect(component.tasks.some(task => task.opened)).toBe(false);
  });

  it('should compute relative due date', () => {
    const component = new TasksComponent(activatedRoute, TestBed.get(NowService));

    component.ngOnInit();

    const task = component.tasks[0];
    task.model.dueDate = '2017-08-01';
    expect(task.relativeDueDate()).toBe('aujourd\'hui');

    task.model.dueDate = '2017-08-02';
    expect(task.relativeDueDate()).toBe('dans un jour');

    task.model.dueDate = '2017-07-31';
    expect(task.relativeDueDate()).toBe('il y a un jour');
  });

  it('should compute due date class', () => {
    const component = new TasksComponent(activatedRoute, TestBed.get(NowService));
    component.ngOnInit();

    const task = component.tasks[0];
    // due yesterday
    task.model.dueDate = '2017-07-31';
    expect(task.dueDateClass()).toBe('text-danger font-weight-bold');

    // due today
    task.model.dueDate = '2017-08-01';
    expect(task.dueDateClass()).toBe('text-danger');

    // due tomorrow
    task.model.dueDate = '2017-08-02';
    expect(task.dueDateClass()).toBe('text-warning');

    // due in 6 days
    task.model.dueDate = '2017-08-07';
    expect(task.dueDateClass()).toBe('text-warning');

    // due in more than 6 days
    task.model.dueDate = '2017-08-08';
    expect(task.dueDateClass()).toBe('');
  });

  it('should toggle', () => {
    const component = new TasksComponent(activatedRoute, TestBed.get(NowService));
    component.ngOnInit();

    const task = component.tasks[0];
    component.toggle(task, new Event('click'));
    expect(task.opened).toBe(true);

    component.toggle(task, new Event('click'));
    expect(task.opened).toBe(false);
  });

  it('should display everything but the description and the no task message when not opened', () => {
    const fixture = TestBed.createComponent(TasksComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('Rien à faire');
    expect(text).toContain('Some title');
    expect(text).toContain('aujourd\'hui');
    expect(text).not.toContain('Some description');
    expect(text).toContain('Assignée à admin');
    expect(text).toContain('Créée par user2');
    expect(text).toContain('Concerne JB Nizet');
  });

  it('should display the description when opened', () => {
    const fixture = TestBed.createComponent(TasksComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.task-title').click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Some description');
  });

  it('should not crash when no due date, no assignee, no creator or no concerned person', () => {
    tasks[0].dueDate = null;
    tasks[0].assignee = null;
    tasks[0].creator = null;
    tasks[0].concernedPerson = null;

    const fixture = TestBed.createComponent(TasksComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Some title');
  });

  it('should display a message when no task', () => {
    // I have no idea why, but splicing the data, or assigning an empty array in the route, has no effect at all.
    // Despite the data being empty before creating the component, it still receives a no-empty array.
    const fixture = TestBed.createComponent(TasksComponent);
    fixture.detectChanges();

    fixture.componentInstance.tasks = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Rien à faire');
    expect(fixture.nativeElement.querySelectorAll('.task-item').length).toBe(0);
  });
});
