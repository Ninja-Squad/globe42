import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TaskCategoriesResolverService } from './task-categories-resolver.service';
import { TaskService } from './task.service';
import { TaskCategoryModel } from './models/task-category.model';
import { createMock } from 'ngx-speculoos';

describe('TaskCategoriesResolverService', () => {
  const fakeTaskService = createMock(TaskService);
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: TaskService, useValue: fakeTaskService }],
      imports: [HttpClientModule]
    })
  );

  it('should retrieve task categories', () => {
    const expectedResults: Observable<Array<TaskCategoryModel>> = of([{ id: 42, name: 'Divers' }]);

    fakeTaskService.listCategories.and.returnValue(expectedResults);

    const resolver = TestBed.inject(TaskCategoriesResolverService);
    const result = resolver.resolve();

    expect(result).toBe(expectedResults);
    expect(fakeTaskService.listCategories).toHaveBeenCalled();
  });
});
