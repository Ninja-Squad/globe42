import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TasksPageComponent } from './tasks-page.component';
import { TaskModel } from '../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../models/page';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskEventType, TasksComponent } from '../tasks/tasks.component';
import { FullnamePipe } from '../fullname.pipe';
import { DateTime } from 'luxon';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { SpentTimesComponent } from '../spent-times/spent-times.component';
import { SpentTimeAddComponent } from '../spent-time-add/spent-time-add.component';
import { DurationPipe } from '../duration.pipe';
import { UserModel } from '../models/user.model';
import { CurrentUserModule } from '../current-user/current-user.module';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';
import { ReactiveFormsModule } from '@angular/forms';

class TasksPageComponentTester extends ComponentTester<TasksPageComponent> {
  constructor() {
    super(TasksPageComponent);
  }

  get tasksComponent() {
    return this.component(TasksComponent);
  }

  get resurrectButton() {
    return this.button('.resurrect-button');
  }

  get pagination() {
    return this.component(NgbPagination);
  }

  get newTaskLink() {
    return this.element('#newTaskLink');
  }

  get pageLinks() {
    return this.elements<HTMLAnchorElement>('a.page-link');
  }
}

describe('TasksPageComponent', () => {
  let page: Page<TaskModel>;
  let data: {
    tasks: Page<TaskModel>;
    taskListType: string;
  };
  let activatedRoute: ActivatedRoute;
  let tester: TasksPageComponentTester;
  let router: Router;

  beforeEach(() => {
    jasmine.clock().mockDate(DateTime.fromISO('2017-08-01T12:30:00').toJSDate());

    const tasks: Array<TaskModel> = [];
    for (let i = 0; i < 3; i++) {
      tasks.push({
        id: i,
        description: 'Some description',
        title: 'Some title',
        category: {
          id: 6,
          name: 'Various'
        },
        dueDate: '2017-08-01',
        status: 'DONE',
        totalSpentTimeInMinutes: 0,
        assignee: null,
        creator: {
          id: 1,
          login: 'admin'
        } as UserModel,
        concernedPerson: null
      });
    }

    page = {
      content: tasks,
      number: 0,
      size: 3,
      totalElements: 8,
      totalPages: 3
    };

    data = {
      taskListType: 'todo',
      tasks: page
    };

    activatedRoute = {
      data: of(data),
      parent: {
        parent: {
          snapshot: {
            data: {}
          }
        }
      }
    } as any;

    TestBed.overrideTemplate(SpentTimeAddComponent, '');
    TestBed.overrideTemplate(SpentTimesComponent, '');

    TestBed.configureTestingModule({
      imports: [
        CurrentUserModule.forRoot(),
        RouterTestingModule,
        GlobeNgbTestingModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      declarations: [
        TasksPageComponent,
        TasksComponent,
        FullnamePipe,
        SpentTimesComponent,
        SpentTimeAddComponent,
        DurationPipe,
        PageTitleDirective
      ],
      providers: [{ provide: ActivatedRoute, useFactory: () => activatedRoute }]
    });

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    tester = new TasksPageComponentTester();
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should display tasks in a task list', () => {
    tester.detectChanges();

    expect(tester.tasksComponent.tasks.map(task => task.model)).toEqual(page.content);

    spyOn(tester.componentInstance, 'onTaskClicked');
    tester.resurrectButton.click();

    expect(tester.componentInstance.onTaskClicked).toHaveBeenCalledWith({
      type: 'resurrect',
      task: page.content[0]
    });
  });

  it('should display a pagination component, and no new task link by default', () => {
    tester.detectChanges();

    expect(tester.pagination.page).toBe(1);
    expect(tester.pagination.pageSize).toBe(3);
    expect(tester.pagination.collectionSize).toBe(8);
    expect(tester.pagination.pageCount).toBe(3);

    expect(tester.newTaskLink).toBeNull();
  });

  it('should navigate to other page when clicking page', fakeAsync(() => {
    tester.detectChanges();

    const page2Link = tester.pageLinks[2];
    expect(page2Link).toContainText('2');
    page2Link.click();

    tick();
    tester.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['.'], {
      relativeTo: activatedRoute,
      queryParams: { page: '1' }
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
    tester.detectChanges();

    const task = page.content[0];
    tester.componentInstance.onTaskClicked({ task, type: 'edit' });

    expect(router.navigate).toHaveBeenCalledWith(['/tasks', task.id, 'edit']);
  });

  it('should edit a task when list type is person-todo', () => {
    data.taskListType = 'person-todo';
    activatedRoute.parent.parent.snapshot.data.person = { id: 42 };

    tester.detectChanges();

    const task = page.content[0];
    tester.componentInstance.onTaskClicked({ task, type: 'edit' });

    expect(router.navigate).toHaveBeenCalledWith([
      '/tasks',
      task.id,
      'edit',
      { 'concerned-person': 42 }
    ]);
  });

  it('should navigate to previous page after task action if current page is obsolete', () => {
    page.number = 2;

    tester.detectChanges();

    const taskService = TestBed.inject(TaskService);
    const tasksResolverService = TestBed.inject(TasksResolverService);

    spyOn(taskService, 'resurrect').and.returnValue(of(null));
    const newPage: Page<TaskModel> = {
      content: page.content,
      number: 2,
      size: 3,
      totalElements: 6,
      totalPages: 2
    };

    spyOn(tasksResolverService, 'resolve').and.returnValue(of(newPage));
    const task = page.content[0];

    tester.componentInstance.onTaskClicked({ task, type: 'resurrect' });

    expect(router.navigate).toHaveBeenCalledWith(['.'], {
      relativeTo: activatedRoute,
      queryParams: { page: '1' }
    });
  });

  it('should display a success message when list type is not archived and no task', () => {
    page.number = 0;
    page.totalElements = 0;
    page.content = [];
    page.totalPages = 0;

    tester.detectChanges();

    expect(tester.testElement).toContainText('Rien à faire');
  });

  it('should display an info message when list type is archived and no task', () => {
    page.number = 0;
    page.totalElements = 0;
    page.content = [];
    page.totalPages = 0;

    data.taskListType = 'archived';

    tester.detectChanges();

    expect(tester.testElement).toContainText('Aucune tâche archivée');
  });

  it('should display an info message when list type is archived and no task', () => {
    page.number = 0;
    page.totalElements = 0;
    page.content = [];
    page.totalPages = 0;

    data.taskListType = 'archived';

    tester.detectChanges();

    expect(tester.testElement).toContainText('Aucune tâche archivée');
  });

  it('should display a new task link with the concerned person as param is list type is person-todo', () => {
    data.taskListType = 'person-todo';
    activatedRoute.parent.parent.snapshot.data.person = { id: 42 };

    tester.detectChanges();

    expect(tester.newTaskLink.attr('href')).toBe('/tasks/create;concerned-person=42');
  });

  function checkEventHandled(
    eventType: TaskEventType,
    taskServiceMethodName: 'assignToSelf' | 'unassign' | 'markAsDone' | 'cancel' | 'resurrect'
  ) {
    tester.detectChanges();

    const taskService = TestBed.inject(TaskService);
    const tasksResolverService = TestBed.inject(TasksResolverService);

    spyOn(taskService, taskServiceMethodName).and.returnValue(of(null));
    const newPage: Page<TaskModel> = {
      content: page.content,
      number: 0,
      size: 3,
      totalElements: 7,
      totalPages: 3
    };

    spyOn(tasksResolverService, 'resolve').and.returnValue(of(newPage));

    const task = page.content[0];

    tester.componentInstance.onTaskClicked({ task, type: eventType });

    expect(taskService[taskServiceMethodName]).toHaveBeenCalledWith(task.id);
    expect(tasksResolverService.resolve).toHaveBeenCalledWith(activatedRoute.snapshot);
    expect(tester.componentInstance.page).toBe(newPage);
  }
});
