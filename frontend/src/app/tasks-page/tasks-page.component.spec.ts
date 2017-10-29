import { async, TestBed } from '@angular/core/testing';

import { TasksPageComponent } from './tasks-page.component';
import { TaskModel } from '../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../models/page';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskEventType, TasksComponent } from '../tasks/tasks.component';
import { FullnamePipe } from '../fullname.pipe';
import { NowService } from '../now.service';
import * as moment from 'moment';
import { By } from '@angular/platform-browser';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { JwtInterceptorService } from '../jwt-interceptor.service';
import { SpentTimesComponent } from '../spent-times/spent-times.component';
import { SpentTimeAddComponent } from '../spent-time-add/spent-time-add.component';
import { DurationPipe } from '../duration.pipe';

describe('TasksPageComponent', () => {
  let page: Page<TaskModel>;
  let data: {
    tasks: Page<TaskModel>;
    taskListType: string;
  };
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    const tasks: Array<TaskModel> = [];
    for (let i = 0; i < 3; i++) {
      tasks.push(
        {
          id: i,
          description: 'Some description',
          title: 'Some title',
          dueDate: '2017-08-01',
          status: 'DONE',
          totalSpentTimeInMinutes: 0,
          assignee: null,
          creator: null,
          concernedPerson: null
        }
      );
    }

    page = {
      content: tasks,
      number: 0,
      size: 3,
      totalElements: 8,
      totalPages: 3,
    };

    data = {
      taskListType: 'todo',
      tasks: page
    };

    activatedRoute = {
      data: Observable.of(data),
      parent: {
        snapshot: {
          data: { }
        }
      }
    } as any;

    TestBed.overrideTemplate(SpentTimeAddComponent, '');
    TestBed.overrideTemplate(SpentTimesComponent, '');

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbModule.forRoot(), HttpClientModule],
      declarations: [
        TasksPageComponent,
        TasksComponent,
        FullnamePipe,
        SpentTimesComponent,
        SpentTimeAddComponent,
        DurationPipe
      ],
      providers: [
        NowService,
        TaskService,
        TasksResolverService,
        UserService,
        JwtInterceptorService,
        { provide: ActivatedRoute, useFactory: () => activatedRoute }
      ]
    });
    moment.locale('fr');

    spyOn(TestBed.get(NowService), 'now').and.callFake(() => moment('2017-08-01T12:30:00'));
  }));

  it('should display tasks in a task list', () => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const tasksPageComponent = fixture.componentInstance;
    const tasksComponent: TasksComponent = fixture.debugElement.query(By.directive(TasksComponent)).componentInstance;
    expect(tasksComponent.tasks.map(task => task.model)).toEqual(page.content);

    spyOn(tasksPageComponent, 'onTaskClicked');
    fixture.nativeElement.querySelector('.resurrect-button').click();
    fixture.detectChanges();
    expect(tasksPageComponent.onTaskClicked).toHaveBeenCalledWith({type: 'resurrect', task: page.content[0]});
  });

  it('should display a pagination component, and no new task link by default', () => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const pagination: NgbPagination = fixture.debugElement.query(By.directive(NgbPagination)).componentInstance;

    expect(pagination.page).toBe(1);
    expect(pagination.pageSize).toBe(3);
    expect(pagination.collectionSize).toBe(8);
    expect(pagination.pageCount).toBe(3);

    expect(fixture.nativeElement.querySelector('#newTaskLink')).toBeFalsy();
  });

  it('should navigate to other page when clicking page', async(() => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const paginationFixture = fixture.debugElement.query(By.directive(NgbPagination));

    const router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const page2Link = paginationFixture.nativeElement.querySelectorAll('a.page-link')[2];
    expect(page2Link.textContent).toContain('2');
    page2Link.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['.'], {relativeTo: activatedRoute, queryParams: {page: '1'}});
    });
  }));

  it('should assign a task and refresh', () => {
    checkEventHandled('assign', 'assignToSelf');
  });

  it('should unassign a task and refresh', () => {
    checkEventHandled('unassign', 'unassign');
  });

  it('should mark a task as done and refresh', () => {
    checkEventHandled('markAsDone', 'markAsDone');
  });

  it('should cancel a task and refresh', () => {
    checkEventHandled('cancel', 'cancel');
  });

  it('should resurrect a task and refresh', () => {
    checkEventHandled('resurrect', 'resurrect');
  });

  it('should edit a task when list type is not person', () => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const task = page.content[0];
    fixture.componentInstance.onTaskClicked({task, type: 'edit'});

    expect(router.navigate).toHaveBeenCalledWith(['/tasks', task.id, 'edit']);
  });

  it('should edit a task when list type is person', () => {
    data.taskListType = 'person';
    activatedRoute.parent.snapshot.data.person = { id: 42 };

    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const task = page.content[0];
    fixture.componentInstance.onTaskClicked({task, type: 'edit'});

    expect(router.navigate).toHaveBeenCalledWith(['/tasks', task.id, 'edit', { 'concerned-person': 42 }]);
  });

  it('should navigate to previous page after task action if current page is obsolete', () => {
    page.number = 2;

    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const taskService = TestBed.get(TaskService);
    const tasksResolverService = TestBed.get(TasksResolverService);

    spyOn(taskService, 'resurrect').and.returnValue(Observable.of(null));
    const newPage: Page<TaskModel> = {
      content: page.content,
      number: 2,
      size: 3,
      totalElements: 6,
      totalPages: 2
    };

    spyOn(tasksResolverService, 'resolve').and.returnValue(Observable.of(newPage));
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const task = page.content[0];

    fixture.componentInstance.onTaskClicked({task, type: 'resurrect'});

    expect(router.navigate).toHaveBeenCalledWith(['.'], {relativeTo: activatedRoute, queryParams: {page: '1'}});
  });

  it('should display a success message when list type is not archived and no task', () => {
    page.number = 0;
    page.totalElements = 0;
    page.content = [];
    page.totalPages = 0;

    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Rien à faire');
  });

  it('should display an info message when list type is archived and no task', () => {
    page.number = 0;
    page.totalElements = 0;
    page.content = [];
    page.totalPages = 0;

    data.taskListType = 'archived';

    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucune tâche archivée');
  });

  it('should display an info message when list type is archived and no task', () => {
    page.number = 0;
    page.totalElements = 0;
    page.content = [];
    page.totalPages = 0;

    data.taskListType = 'archived';

    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucune tâche archivée');
  });

  it('should display a new task link with the concerned person as param is list type is person', () => {
    data.taskListType = 'person';
    activatedRoute.parent.snapshot.data.person = { id: 42 };

    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#newTaskLink').getAttribute('href')).toBe('/tasks/create;concerned-person=42');
  });

  function checkEventHandled(eventType: TaskEventType, taskServiceMethodName: string) {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const taskService = TestBed.get(TaskService);
    const tasksResolverService = TestBed.get(TasksResolverService);

    spyOn(taskService, taskServiceMethodName).and.returnValue(Observable.of(null));
    const newPage: Page<TaskModel> = {
      content: page.content,
      number: 0,
      size: 3,
      totalElements: 7,
      totalPages: 3
    };

    spyOn(tasksResolverService, 'resolve').and.returnValue(Observable.of(newPage));

    const task = page.content[0];

    fixture.componentInstance.onTaskClicked({task, type: eventType});

    expect(taskService[taskServiceMethodName]).toHaveBeenCalledWith(task.id);
    expect(tasksResolverService.resolve).toHaveBeenCalledWith(activatedRoute.snapshot);
    expect(fixture.componentInstance.page).toBe(newPage);
  }
});
