import { TestBed } from '@angular/core/testing';

import { TaskResolverService } from './task-resolver.service';
import { TaskService } from './task.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskModel } from './models/task.model';
import { ActivatedRouteSnapshot, convertToParamMap, Params } from '@angular/router';
import { CurrentUserModule } from './current-user/current-user.module';
import { of } from 'rxjs/observable/of';

describe('TaskResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [TaskResolverService, TaskService],
    imports: [CurrentUserModule.forRoot(), HttpClientModule]
  }));

  it('should resolve a task', () => {
    const taskService = TestBed.get(TaskService);
    const expectedResult = of({ id: 42 } as TaskModel);

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
