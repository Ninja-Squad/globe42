import { TestBed } from '@angular/core/testing';

import { TasksResolverService } from './tasks-resolver.service';
import { TaskService } from './task.service';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TaskModel } from './models/task.model';
import { Page } from './models/page';
import { CurrentUserModule } from './current-user/current-user.module';
import { of } from 'rxjs';
import { CurrentPersonService } from './current-person.service';

describe('TasksResolverService', () => {
  let resolver: TasksResolverService;
  let taskService: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), HttpClientModule]
    });

    resolver = TestBed.get(TasksResolverService);
    taskService = TestBed.get(TaskService);
  });

  function routeWithType(taskListType: string): ActivatedRouteSnapshot {
    const result: any = {
      data: {
        taskListType
      },
      queryParamMap: convertToParamMap({})
    };
    return result;
  }

  it('should resolve tasks for todo list type', () => {
    const route = routeWithType('todo');
    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listTodo').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listTodo).toHaveBeenCalledWith(0);
  });

  it('should resolve tasks for mine list type', () => {
    const route = routeWithType('mine');
    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listMine').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listMine).toHaveBeenCalledWith(0);
  });

  it('should resolve tasks for urgent list type', () => {
    const route = routeWithType('urgent');
    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listUrgent').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listUrgent).toHaveBeenCalledWith(0);
  });

  it('should resolve tasks for unassigned list type', () => {
    const route = routeWithType('unassigned');
    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listUnassigned').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listUnassigned).toHaveBeenCalledWith(0);
  });

  it('should resolve tasks for archived list type', () => {
    const route = routeWithType('archived');
    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listArchived').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listArchived).toHaveBeenCalledWith(0);
  });

  it('should resolve tasks for person-todo list type', () => {
    const route: any = routeWithType('person-todo');
    const currentPersonService: CurrentPersonService = TestBed.get(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 });

    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listTodoForPerson').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listTodoForPerson).toHaveBeenCalledWith(42, 0);
  });

  it('should resolve tasks for person-archived list type', () => {
    const route: any = routeWithType('person-archived');
    const currentPersonService: CurrentPersonService = TestBed.get(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 });

    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listArchivedForPerson').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listArchivedForPerson).toHaveBeenCalledWith(42, 0);
  });

  it('should resolve tasks when page is present', () => {
    const route = routeWithType('archived');
    (route as any).queryParamMap = convertToParamMap({page: '2'});
    const expected = of({} as Page<TaskModel>);
    spyOn(taskService, 'listArchived').and.returnValue(expected);
    expect(resolver.resolve(route)).toBe(expected);
    expect(taskService.listArchived).toHaveBeenCalledWith(2);
  });

  it('should throw when unknown list type', () => {
    const route = routeWithType('unknown');
    try {
      resolver.resolve(route);
      fail('should have thrown');
    } catch (e) {
      expect(e.message).toBeTruthy();
    }
  });
});
