import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TaskCategoriesResolverService } from './task-categories-resolver.service';
import { TaskService } from './task.service';
import { TaskCategoryModel } from './models/task-category.model';

describe('TaskCategoriesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TaskCategoriesResolverService,
      { provide: TaskService, useValue: jasmine.createSpyObj('TaskService', ['listCategories'])}
    ],
    imports: [HttpClientModule]
  }));

  it('should retrieve task categories', () => {
    const taskService = TestBed.get(TaskService);
    const expectedResults: Observable<Array<TaskCategoryModel>> = Observable.of([{ id: 42, name: 'Divers' }]);

    taskService.listCategories.and.returnValue(expectedResults);

    const resolver = TestBed.get(TaskCategoriesResolverService);
    const result = resolver.resolve(null);

    expect(result).toBe(expectedResults);
    expect(taskService.listCategories).toHaveBeenCalled();
  });
});
