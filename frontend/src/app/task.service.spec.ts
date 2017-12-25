import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskModel } from './models/task.model';
import { Observable } from 'rxjs/Observable';
import { NowService } from './now.service';
import { Page } from './models/page';
import { SpentTimeModel } from './models/spent-time.model';
import { HttpTester } from './http-tester.spec';
import { UserModel } from './models/user.model';
import { TaskCategoryModel } from './models/task-category.model';
import { CurrentUserModule } from './current-user/current-user.module';
import { CurrentUserService } from './current-user/current-user.service';
import { DateTime } from 'luxon';

describe('TaskService', () => {
  let service: TaskService;
  let httpTester: HttpTester;
  let currentUserService: CurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NowService, TaskService],
      imports: [ CurrentUserModule.forRoot(), HttpClientTestingModule ]
    });

    service = TestBed.get(TaskService);
    currentUserService = TestBed.get(CurrentUserService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
    spyOn(TestBed.get(NowService), 'now').and.callFake(() => DateTime.fromISO('2017-08-02T15:30:00'));
  });

  function checkPage(methodToTest: () => Observable<Page<TaskModel>>, expectedUrl: string) {
    const expectedPage = {
      content: [{id: 1}, {id: 2}] as Array<TaskModel>,
      number: 2
    } as Page<TaskModel>;
    httpTester.testGet(expectedUrl, expectedPage, methodToTest());
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
    currentUserService.userEvents.next({ id : 42 } as UserModel);
    httpTester.testPost('/api/tasks/1/assignments', { userId: 42 }, null, service.assignToSelf(1));
  });

  it('should unassign a task', () => {
    httpTester.testDelete('/api/tasks/1/assignments', service.unassign(1));
  });

  it('should cancel a task', () => {
    httpTester.testPost('/api/tasks/1/status-changes', { newStatus: 'CANCELLED' }, null, service.cancel(1));
  });

  it('should mark a task as done', () => {
    httpTester.testPost('/api/tasks/1/status-changes', { newStatus: 'DONE' }, null, service.markAsDone(1));
  });

  it('should resurrect a task', () => {
    httpTester.testPost('/api/tasks/1/status-changes', { newStatus: 'TODO' }, null, service.resurrect(1));
  });

  it('should list spent times', () => {
    const expectedSpentTimes = [{ id: 1 }] as Array<SpentTimeModel>;
    httpTester.testGet('/api/tasks/42/spent-times', expectedSpentTimes, service.listSpentTimes(42));
  });

  it('should create a spent time', () => {
    const expectedSpentTime = { id: 1 } as SpentTimeModel;
    httpTester.testPost(
      '/api/tasks/42/spent-times',
      { minutes: 10 },
      expectedSpentTime,
      service.addSpentTime(42, 10));
  });

  it('should delete a spent time', () => {
    httpTester.testDelete('/api/tasks/42/spent-times/1', service.deleteSpentTime(42, 1));
  });

  it('should list and sort task categories', () => {
    const categories = [{ id: 1, name: 'b' }, { id: 2, name: 'a' }] as Array<TaskCategoryModel>;

    let actualCategories: Array<TaskCategoryModel> = null;
    service.listCategories().subscribe(result => actualCategories = result);

    TestBed.get(HttpTestingController).expectOne({url: '/api/task-categories', method: 'GET'}).flush(categories);

    expect(actualCategories).toEqual([{ id: 2, name: 'a' }, { id: 1, name: 'b' }]);
  });
});
