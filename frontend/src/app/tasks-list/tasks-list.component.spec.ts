import { async, TestBed } from '@angular/core/testing';

import { TaskModel } from '../models/task.model';
import { FullnamePipe } from '../fullname.pipe';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NowService } from '../now.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksListComponent } from './tasks-list.component';
import { By } from '@angular/platform-browser';
import { TasksComponent } from '../tasks/tasks.component';

describe('TasksListComponent', () => {
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
        assignee: null,
        creator: null,
        concernedPerson: null
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
      declarations: [TasksListComponent, TasksComponent, FullnamePipe],
      providers: [
        NowService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });
    moment.locale('fr');

    spyOn(TestBed.get(NowService), 'now').and.callFake(() => moment('2017-08-01T12:30:00'));
  }));

  it('should sort tasks in due date order, with tasks without due date last', () => {
    tasks.push({
      id: 14,
      dueDate: null
    } as any);
    tasks.push({
      id: 13,
      dueDate: '2017-07-31'
    } as any);

    const component = new TasksListComponent(activatedRoute, TestBed.get(NowService));
    component.ngOnInit();

    expect(component.tasks.map(task => task.id)).toEqual([13, 12, 14]);
  });

  it('should display tasks in a task list', () => {
    const fixture = TestBed.createComponent(TasksListComponent);
    fixture.detectChanges();

    const tasksComponent: TasksComponent = fixture.debugElement.query(By.directive(TasksComponent)).componentInstance;

    expect(tasksComponent.tasks.map(task => task.model)).toEqual(tasks);
  });
});
