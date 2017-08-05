import { TestBed, inject } from '@angular/core/testing';

import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskModel } from './models/task.model';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { NowService } from './now.service';
import { Page } from './models/page';
import { UserService } from './user.service';
import { JwtInterceptorService } from './jwt-interceptor.service';

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, JwtInterceptorService, NowService, TaskService],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(TaskService);
    http = TestBed.get(HttpTestingController);
    spyOn(TestBed.get(NowService), 'now').and.callFake(() => moment('2017-08-02T15:30:00'));
  });

  function checkPage(methodToTest: () => Observable<Page<TaskModel>>, expectedUrl: string) {
    const expectedPage = {
      content: [{id: 1}, {id: 2}] as Array<TaskModel>,
      number: 2
    } as Page<TaskModel>;

    let actualPage;
    methodToTest().subscribe(page => actualPage = page);

    http.expectOne({url: expectedUrl, method: 'GET'}).flush(expectedPage);
    expect(actualPage).toEqual(expectedPage);
  }

  it('should list todo tasks', () => {
    checkPage(() => service.listTodo(2), '/api/tasks?page=2');
  });

  it('should list my tasks', () => {
    checkPage(() => service.listMine(2), '/api/tasks?page=2&mine=');
  });

  it('should list my tasks', () => {
    checkPage(() => service.listUrgent(2), '/api/tasks?page=2&before=2017-08-09');
  });

  it('should list unassigned tasks', () => {
    checkPage(() => service.listUnassigned(2), '/api/tasks?page=2&unassigned=');
  });

  it('should list tasks concerning person', () => {
    checkPage(() => service.listForPerson(42, 2), '/api/tasks?page=2&person=42');
  });

  it('should list archived tasks', () => {
    checkPage(() => service.listArchived(2), '/api/tasks?page=2&archived=');
  });

  it('should assign to current user', () => {
    const userService = TestBed.get(UserService);
    userService.userEvents.next({ id : 42 });

    let ok = false;
    service.assignToSelf(1).subscribe(() => ok = true);

    const testRequest = http.expectOne({ url: '/api/tasks/1/assignments', method: 'POST' });
    expect(testRequest.request.body).toEqual({ userId: 42 });
    testRequest.flush(null);

    expect(ok).toBe(true);
  });

  it('should cancel a task', () => {
    let ok = false;
    service.cancel(1).subscribe(() => ok = true);

    const testRequest = http.expectOne({ url: '/api/tasks/1/status-changes', method: 'POST' });
    expect(testRequest.request.body).toEqual({ newStatus: 'CANCELLED' });
    testRequest.flush(null);

    expect(ok).toBe(true);
  });

  it('should mark a task as done', () => {
    let ok = false;
    service.markAsDone(1).subscribe(() => ok = true);

    const testRequest = http.expectOne({ url: '/api/tasks/1/status-changes', method: 'POST' });
    expect(testRequest.request.body).toEqual({ newStatus: 'DONE' });
    testRequest.flush(null);

    expect(ok).toBe(true);
  });

  it('should resurrect a task', () => {
    let ok = false;
    service.resurrect(1).subscribe(() => ok = true);

    const testRequest = http.expectOne({ url: '/api/tasks/1/status-changes', method: 'POST' });
    expect(testRequest.request.body).toEqual({ newStatus: 'TODO' });
    testRequest.flush(null);

    expect(ok).toBe(true);
  });
});
