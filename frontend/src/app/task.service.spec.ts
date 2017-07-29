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

  function checkList(methodToTest: () => Observable<Array<TaskModel>>, expectedUrl: string) {
    const expectedTasks = [{ id: 1 }, { id: 2 }] as Array<TaskModel>;

    let actualTasks;
    methodToTest().subscribe(tasks => actualTasks = tasks);

    http.expectOne({url: expectedUrl, method: 'GET'}).flush(expectedTasks);
    expect(actualTasks).toEqual(expectedTasks);
  }

  it('should list todo tasks', () => {
    checkList(() => service.listTodo(), '/api/tasks');
  });

  it('should list my tasks', () => {
    checkList(() => service.listMine(), '/api/tasks?mine');
  });

  it('should list my tasks', () => {
    checkList(() => service.listUrgent(), '/api/tasks?before=2017-08-09');
  });

  it('should list unassigned tasks', () => {
    checkList(() => service.listUnassigned(), '/api/tasks?unassigned');
  });

  it('should list tasks concerning person', () => {
    checkList(() => service.listForPerson(42), '/api/tasks?person=42');
  });

  it('should get a page of archived tasks', () => {
    const expectedPage = {
      content: [{id: 1}, {id: 2}] as Array<TaskModel>,
      number: 2
    } as Page<TaskModel>

    let actualPage;
    service.listArchived(2).subscribe(page => actualPage = page);

    http.expectOne({url: '/api/tasks?archived=&page=2', method: 'GET'}).flush(expectedPage);
    expect(actualPage).toEqual(expectedPage);
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
