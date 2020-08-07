import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TaskEditComponent } from './task-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { PersonIdentityModel } from '../models/person.model';
import { UserModel } from '../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from '../task.service';
import { TaskModel } from '../models/task.model';
import { TaskCategoryModel } from '../models/task-category.model';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { of } from 'rxjs';
import { ComponentTester } from 'ngx-speculoos';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';

class TaskEditTester extends ComponentTester<TaskEditComponent> {
  constructor() {
    super(TaskEditComponent);
  }

  get pageTitle() {
    return this.element('h1');
  }

  get title() {
    return this.input('#title');
  }

  get description() {
    return this.textarea('#description');
  }

  get category() {
    return this.select('#category');
  }

  get dueDate() {
    return this.input('#dueDate');
  }

  get concernedPerson() {
    return this.input('#concernedPerson');
  }

  fillConcernedPersonAndTick(text: string) {
    this.concernedPerson.fillWith(text);
    tick(500);
    this.detectChanges();
  }

  get concernedPersonSuggestions() {
    return this.elements<HTMLButtonElement>('button.dropdown-item');
  }

  get assignee() {
    return this.select('#assignee');
  }

  get save() {
    return this.button('#save');
  }

  get cancel() {
    return this.element('#cancel');
  }
}

describe('TaskEditComponent', () => {
  let persons: Array<PersonIdentityModel>;
  let users: Array<UserModel>;
  let categories: Array<TaskCategoryModel>;

  beforeEach(() => {
    persons = [
      { id: 1, firstName: 'Cedric', lastName: 'Exbrayat', nickName: 'Hype', mediationCode: 'C1' },
      { id: 2, firstName: 'Jean-Baptiste', lastName: 'Nizet', nickName: null, mediationCode: null }
    ];

    users = [
      { id: 4, login: 'cyril', admin: true },
      { id: 5, login: 'agnes', admin: false },
      { id: 3, login: 'admin', admin: true }
    ];

    categories = [
      { id: 6, name: 'Various' },
      { id: 7, name: 'Meal' }
    ];
  });

  function prepareModule(task: TaskModel, concernedPersonId: number) {
    const activatedRoute = {
      snapshot: {
        data: {
          persons,
          users,
          categories,
          task
        },
        paramMap: convertToParamMap(
          concernedPersonId ? { 'concerned-person': concernedPersonId.toString() } : {}
        )
      }
    } as any;

    TestBed.configureTestingModule({
      imports: [
        CurrentUserModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        GlobeNgbTestingModule,
        HttpClientModule,
        ValdemortModule
      ],
      declarations: [TaskEditComponent, ValidationDefaultsComponent, PageTitleDirective],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

    // different object on purpose
    TestBed.inject(CurrentUserService).userEvents.next({ id: 3, login: 'admin', admin: false });
  }

  describe('creation mode', () => {
    beforeEach(() => {
      prepareModule(null, null);
    });

    it('should have a title and an empty form', () => {
      const tester = new TaskEditTester();
      tester.detectChanges();

      expect(tester.pageTitle).toHaveText('Nouvelle tâche');
      expect(tester.title).toHaveValue('');
      expect(tester.description).toHaveValue('');
      expect(tester.category.optionLabels).toEqual(['', 'Various', 'Meal']);
      expect(tester.category).toHaveSelectedLabel('');
      expect(tester.dueDate).toHaveValue('');
      expect(tester.concernedPerson).toHaveValue('');
      expect(tester.assignee.optionLabels).toEqual(['', 'Moi', 'agnes', 'cyril']);
      expect(tester.assignee).toHaveSelectedLabel('');

      expect(tester.save.disabled).toBe(false);
      expect(tester.cancel.attr('href')).toBe('/tasks');
    });

    function checkPersonTypeaheadWorks(tester: TaskEditTester, searchText: string) {
      tester.fillConcernedPersonAndTick(searchText);

      const suggestions = tester.concernedPersonSuggestions;
      expect(suggestions.length).toBe(1);
      expect(suggestions[0].textContent).toContain('Cedric Exbrayat (Hype)');
    }

    it('should have a typeahead searching by various parts of the identity', fakeAsync(() => {
      const tester = new TaskEditTester();
      tester.detectChanges();

      // search by first name
      checkPersonTypeaheadWorks(tester, 'ced');
      // search by last name
      checkPersonTypeaheadWorks(tester, 'EXBR');
      // search by nick name
      checkPersonTypeaheadWorks(tester, 'Hy');
      // search by mediation code
      checkPersonTypeaheadWorks(tester, 'C1');
    }));

    it('should select a person, then display a warning when text is edited, and clear the field on blur', fakeAsync(() => {
      const tester = new TaskEditTester();
      tester.detectChanges();

      tester.fillConcernedPersonAndTick('ced');
      tester.concernedPersonSuggestions[0].click();

      expect(tester.concernedPerson).toHaveValue('Cedric Exbrayat (Hype)');
      expect(tester.componentInstance.taskForm.value.concernedPerson).toEqual(persons[0]);

      tester.fillConcernedPersonAndTick('Cedric Exbrayat (Hyp');

      expect(tester.componentInstance.taskForm.value.concernedPerson).toBeFalsy();
      expect(tester.concernedPerson).toHaveClass('is-warning');

      tester.concernedPerson.dispatchEventOfType('blur');
      expect(tester.concernedPerson).toHaveValue('');
    }));

    it('should save', fakeAsync(() => {
      const tester = new TaskEditTester();
      tester.detectChanges();

      tester.title.fillWith('test title');
      tester.description.fillWith('test description');
      tester.category.selectIndex(1);
      tester.dueDate.fillWith('02/01/2018');
      expect(tester.componentInstance.taskForm.value.dueDate).toBe('2018-01-02');

      tester.fillConcernedPersonAndTick('ced');
      tester.concernedPersonSuggestions[0].click();
      tester.assignee.selectIndex(1);

      const taskService = TestBed.inject(TaskService);
      const router = TestBed.inject(Router);
      spyOn(taskService, 'create').and.returnValue(of({ id: 42 } as TaskModel));
      spyOn(router, 'navigate');

      tester.save.click();

      expect(taskService.create).toHaveBeenCalledWith({
        title: 'test title',
        description: 'test description',
        categoryId: 6,
        dueDate: '2018-01-02',
        concernedPersonId: 1,
        assigneeId: 3
      });
      expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    }));
  });

  describe('creation mode with concerned person', () => {
    beforeEach(() => {
      prepareModule(null, 1);
    });

    it('should have a prepopulated concerned person and redirect to the person task page after save', () => {
      const tester = new TaskEditTester();
      tester.detectChanges();

      expect(tester.componentInstance.taskForm.value.concernedPerson).toEqual(persons[0]);
      expect(tester.concernedPerson).toHaveValue('Cedric Exbrayat (Hype)');
      expect(tester.cancel.attr('href')).toBe('/persons/1/tasks');

      tester.title.fillWith('test title');
      tester.category.selectIndex(1);
      tester.description.fillWith('test description');

      const taskService = TestBed.inject(TaskService);
      const router = TestBed.inject(Router);
      spyOn(taskService, 'create').and.returnValue(of({ id: 42 } as TaskModel));
      spyOn(router, 'navigate');

      tester.save.click();

      expect(taskService.create).toHaveBeenCalledWith({
        title: 'test title',
        description: 'test description',
        categoryId: 6,
        dueDate: null,
        concernedPersonId: 1,
        assigneeId: null
      });
      expect(router.navigate).toHaveBeenCalledWith(['/persons', '1', 'tasks']);
    });
  });

  describe('edition mode', () => {
    beforeEach(() => {
      const task = {
        id: 42,
        title: 'test title',
        category: {
          id: 7,
          name: 'Meal'
        },
        description: 'test description',
        dueDate: '2018-01-02',
        concernedPerson: { id: 1 } as PersonIdentityModel,
        assignee: { id: 3 } as UserModel
      } as TaskModel;

      prepareModule(task, null);
    });

    it('should have a title and a prepopulated form', () => {
      const tester = new TaskEditTester();
      tester.detectChanges();

      expect(tester.pageTitle).toContainText('Modification de la tâche test title');
      expect(tester.title).toHaveValue('test title');
      expect(tester.description).toHaveValue('test description');
      expect(tester.category).toHaveSelectedLabel('Meal');
      expect(tester.componentInstance.taskForm.value.category).toEqual(categories[1]);
      expect(tester.dueDate).toHaveValue('02/01/2018');
      expect(tester.componentInstance.taskForm.value.dueDate).toBe('2018-01-02');
      expect(tester.concernedPerson).toHaveValue('Cedric Exbrayat (Hype)');
      expect(tester.componentInstance.taskForm.value.concernedPerson).toEqual(persons[0]);
      expect(tester.assignee).toHaveSelectedLabel('Moi');
      expect(tester.componentInstance.taskForm.value.assignee).toEqual(users[2]);
      expect(tester.save.disabled).toBe(false);
    });

    it('should save', () => {
      const tester = new TaskEditTester();
      tester.detectChanges();

      const taskService = TestBed.inject(TaskService);
      const router = TestBed.inject(Router);
      spyOn(taskService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      tester.save.click();

      expect(taskService.update).toHaveBeenCalledWith(42, {
        title: 'test title',
        description: 'test description',
        categoryId: 7,
        dueDate: '2018-01-02',
        concernedPersonId: 1,
        assigneeId: 3
      });
      expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    });
  });
});
