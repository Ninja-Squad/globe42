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
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user.service';
import { JwtInterceptorService } from "app/jwt-interceptor.service";
import { HttpClientModule } from '@angular/common/http';

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
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [TasksListComponent, TasksComponent, FullnamePipe],
      providers: [
        NowService,
        TaskService,
        TasksResolverService,
        UserService,
        JwtInterceptorService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });
    moment.locale('fr');

    spyOn(TestBed.get(NowService), 'now').and.callFake(() => moment('2017-08-01T12:30:00'));
  }));


  function createComponent() {
    const component = new TasksListComponent(
      activatedRoute,
      TestBed.get(NowService),
      TestBed.get(TaskService),
      TestBed.get(TasksResolverService));

    component.ngOnInit();
    return component;
  }

  it('should sort tasks in due date order, with tasks without due date last', () => {
    tasks.push({
      id: 14,
      dueDate: null
    } as any);
    tasks.push({
      id: 13,
      dueDate: '2017-07-31'
    } as any);

    const component = createComponent();

    expect(component.tasks.map(task => task.id)).toEqual([13, 12, 14]);
  });

  it('should display tasks in a task list and react to events', () => {
    const fixture = TestBed.createComponent(TasksListComponent);
    fixture.detectChanges();

    const tasksListComponent = fixture.componentInstance;

    const tasksComponent: TasksComponent = fixture.debugElement.query(By.directive(TasksComponent)).componentInstance;
    expect(tasksComponent.tasks.map(task => task.model)).toEqual(tasks);

    spyOn(tasksListComponent, 'onTaskClicked');
    fixture.nativeElement.querySelector('.assign-button').click();
    fixture.detectChanges();
    expect(tasksListComponent.onTaskClicked).toHaveBeenCalledWith({type: 'assign', task: tasks[0]});
  });

  it('should assign task to the current user and refresh', () => {
    const component = createComponent();

    const taskService = TestBed.get(TaskService);
    const tasksResolverService = TestBed.get(TasksResolverService);

    spyOn(taskService, 'assignToSelf').and.returnValue(Observable.of(null));
    const newTaskModels = [{ id: 56 }, { id: 57, dueDate: '2017-08-01' }] as Array<TaskModel>;
    spyOn(tasksResolverService, 'resolve').and.returnValue(Observable.of(newTaskModels));

    const task = tasks[0];

    component.onTaskClicked({task, type: 'assign'});

    expect(taskService.assignToSelf).toHaveBeenCalledWith(task.id);
    expect(tasksResolverService.resolve).toHaveBeenCalledWith(activatedRoute.snapshot);
    expect(component.tasks.map(t => t.id)).toEqual([57, 56]);
  });

  it('should cancel a task and refresh', () => {
    const component = createComponent();

    const taskService = TestBed.get(TaskService);
    const tasksResolverService = TestBed.get(TasksResolverService);

    spyOn(taskService, 'cancel').and.returnValue(Observable.of(null));
    const newTaskModels = [{ id: 56 }, { id: 57, dueDate: '2017-08-01' }] as Array<TaskModel>;
    spyOn(tasksResolverService, 'resolve').and.returnValue(Observable.of(newTaskModels));

    const task = component.tasks[0];

    component.onTaskClicked({task, type: 'cancel'});

    expect(taskService.cancel).toHaveBeenCalledWith(task.id);
    expect(tasksResolverService.resolve).toHaveBeenCalledWith(activatedRoute.snapshot);
    expect(component.tasks.map(t => t.id)).toEqual([57, 56]);
  });

  it('should mark as done and refresh', () => {
    const component = createComponent();

    const taskService = TestBed.get(TaskService);
    const tasksResolverService = TestBed.get(TasksResolverService);

    spyOn(taskService, 'markAsDone').and.returnValue(Observable.of(null));
    const newTaskModels = [{ id: 56 }, { id: 57, dueDate: '2017-08-01' }] as Array<TaskModel>;
    spyOn(tasksResolverService, 'resolve').and.returnValue(Observable.of(newTaskModels));

    const task = component.tasks[0];

    component.onTaskClicked({task, type: 'markAsDone'});

    expect(taskService.markAsDone).toHaveBeenCalledWith(task.id);
    expect(tasksResolverService.resolve).toHaveBeenCalledWith(activatedRoute.snapshot);
    expect(component.tasks.map(t => t.id)).toEqual([57, 56]);
  });
});
