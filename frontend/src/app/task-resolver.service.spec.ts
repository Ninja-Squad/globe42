import { TestBed, inject } from '@angular/core/testing';

import { TaskResolverService } from './task-resolver.service';
import { TaskService } from './task.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TaskModel } from './models/task.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { NowService } from './now.service';
import { UserService } from './user.service';
import { JwtInterceptorService } from './jwt-interceptor.service';

describe('TaskResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [TaskResolverService, TaskService, NowService, UserService, JwtInterceptorService],
    imports: [HttpClientModule]
  }));

  it('should resolve a task', () => {
    const taskService = TestBed.get(TaskService);
    const expectedResult: Observable<TaskModel> = Observable.of({ id: 42 });

    spyOn(taskService, 'get').and.returnValue(expectedResult);

    const resolver = TestBed.get(TaskResolverService);
    const params = { id: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult);
    expect(taskService.get).toHaveBeenCalledWith(42);
  });
});
