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
      imports: [RouterTestingModule, NgbModule.forRoot()],
      declarations: [TasksPageComponent, TasksComponent, FullnamePipe],
      providers: [
        NowService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });
    moment.locale('fr');

    spyOn(TestBed.get(NowService), 'now').and.callFake(() => moment('2017-08-01T12:30:00'));
  }));

  it('should display tasks in a task list', () => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    fixture.detectChanges();

    const tasksComponent: TasksComponent = fixture.debugElement.query(By.directive(TasksComponent)).componentInstance;

    expect(tasksComponent.tasks.map(task => task.model)).toEqual(page.content);
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
});
