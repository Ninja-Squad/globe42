import { async, TestBed } from '@angular/core/testing';

import { TasksPageComponent } from './tasks-page.component';
import { TaskModel } from '../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../models/page';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksComponent } from '../tasks/tasks.component';
import { FullnamePipe } from '../fullname.pipe';
import { NowService } from '../now.service';
import moment = require('moment');
import { By } from '@angular/platform-browser';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { JwtInterceptorService } from '../jwt-interceptor.service';

describe('TasksPageComponent', () => {
  let page: Page<TaskModel>;
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

    activatedRoute = {
      data: Observable.of({
        tasks: page
      })
    } as any;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbModule.forRoot(), HttpClientModule],
      declarations: [TasksPageComponent, TasksComponent, FullnamePipe],
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

  it('should display a pagination component', () => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const pagination: NgbPagination = fixture.debugElement.query(By.directive(NgbPagination)).componentInstance;

    expect(pagination.page).toBe(1);
    expect(pagination.pageSize).toBe(3);
    expect(pagination.collectionSize).toBe(8);
    expect(pagination.pageCount).toBe(3);
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

  it('should resurrect a task and refresh', () => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const taskService = TestBed.get(TaskService);
    const tasksResolverService = TestBed.get(TasksResolverService);

    spyOn(taskService, 'resurrect').and.returnValue(Observable.of(null));
    const newPage: Page<TaskModel> = {
      content: page.content,
      number: 0,
      size: 3,
      totalElements: 7,
      totalPages: 3
    };

    spyOn(tasksResolverService, 'resolve').and.returnValue(Observable.of(newPage));

    const task = page.content[0];

    fixture.componentInstance.onTaskClicked({task, type: 'resurrect'});

    expect(taskService.resurrect).toHaveBeenCalledWith(task.id);
    expect(tasksResolverService.resolve).toHaveBeenCalledWith(activatedRoute.snapshot);
    expect(fixture.componentInstance.page).toBe(newPage);
  });

  it('should navigate to previous page if current page is obsolete', () => {
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
});
