import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TaskEditComponent } from './task-edit.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullnamePipe } from '../fullname.pipe';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { PersonIdentityModel } from '../models/person.model';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtInterceptorService } from '../jwt-interceptor.service';
import { TaskService } from '../task.service';
import { NowService } from '../now.service';
import { Observable } from 'rxjs/Observable';
import { TaskModel } from '../models/task.model';

describe('TaskEditComponent', () => {

  let persons: Array<PersonIdentityModel>;
  let users: Array<UserModel>;

  beforeEach(async(() => {
    persons = [
      { id: 1, firstName: 'Cedric', lastName: 'Exbrayat', nickName: 'Hype', mediationCode: 'C1' },
      { id: 2, firstName: 'Jean-Baptiste', lastName: 'Nizet', nickName: null, mediationCode: null },
    ];

    users = [
      { id: 4, login: 'cyril', admin: true },
      { id: 5, login: 'agnes', admin: false },
      { id: 3, login: 'admin', admin: true }
    ];
  }));

  function prepareModule(task: TaskModel, concernedPersonId: number) {
    const activatedRoute = {
      snapshot: {
        data: {
          persons,
          users,
          task
        },
        paramMap: convertToParamMap(concernedPersonId ? {'concerned-person': concernedPersonId.toString()} : {})
      }
    } as any;

    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, NgbModule.forRoot(), HttpClientModule],
      declarations: [TaskEditComponent],
      providers: [
        TaskService,
        NowService,
        FullnamePipe,
        UserService,
        JwtInterceptorService,
        {provide: ActivatedRoute, useValue: activatedRoute}
      ]
    });

    // different object on purpose
    TestBed.get(UserService).userEvents.next({id: 3, login: 'admin', admin: false});
  }

  describe('creation mode', () => {

    beforeEach(() => {
      prepareModule(null, null);
    });

    it('should have a title and an empty form', () => {
      const fixture = TestBed.createComponent(TaskEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const element = fixture.nativeElement;
        expect(element.querySelector('h1').textContent).toContain('Nouvelle tâche');

        expect(element.querySelector('input#title').value).toBe('');
        expect(element.querySelector('textarea#description').value).toBe('');
        expect(element.querySelector('input#dueDate').value).toBe('');
        expect(element.querySelector('input#concernedPerson').value).toBe('');
        const assigneeSelect: HTMLSelectElement = element.querySelector('select#assignee');
        expect(assigneeSelect.options[0].textContent).toBe('');
        expect(assigneeSelect.options[1].textContent).toBe('Moi');
        expect(assigneeSelect.options[2].textContent).toBe('agnes');
        expect(assigneeSelect.options[3].textContent).toBe('cyril');
        expect(assigneeSelect.selectedIndex).toBe(-1);

        expect(element.querySelector('#save').disabled).toBe(true);
        expect(element.querySelector('#cancel').getAttribute('href')).toBe('/tasks');
      });
    });

    function checkPersonTypeaheadWorks(fixture: ComponentFixture<TaskEditComponent>, searchText: string) {
      const person = fixture.nativeElement.querySelector('input#concernedPerson');
      person.value = searchText;
      person.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      const suggestions = fixture.nativeElement.querySelectorAll('button.dropdown-item');
      expect(suggestions.length).toBe(1);
      expect(suggestions[0].textContent).toContain('Cedric Exbrayat (Hype)');
    }

    it('should have a typeahead searching by various parts of the identity', fakeAsync(() => {
      const fixture = TestBed.createComponent(TaskEditComponent);
      fixture.detectChanges();

      tick();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        tick();

        const element = fixture.nativeElement;

        // search by first name
        checkPersonTypeaheadWorks(fixture, 'ced');
        // search by last name
        checkPersonTypeaheadWorks(fixture, 'EXBR');
        // search by nick name
        checkPersonTypeaheadWorks(fixture, 'Hy');
        // search by mediation code
        checkPersonTypeaheadWorks(fixture, 'C1');
      });
    }));

    it('should select a person, then display a warning when text is edited, and clear the field on blur', fakeAsync(() => {
      const fixture = TestBed.createComponent(TaskEditComponent);
      fixture.detectChanges();

      tick();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        tick();

        const element = fixture.nativeElement;
        checkPersonTypeaheadWorks(fixture, 'ced');

        fixture.nativeElement.querySelector('button.dropdown-item').click();
        fixture.detectChanges();
        tick();

        const personInput = element.querySelector('input#concernedPerson');
        expect(personInput.value).toBe('Cedric Exbrayat (Hype)');
        expect(fixture.componentInstance.task.concernedPerson).toEqual(persons[0]);

        personInput.value = 'Cedric Exbrayat (Hyp';
        personInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick(500);
        fixture.detectChanges();

        expect(fixture.componentInstance.task.concernedPerson).toBeFalsy();
        expect(personInput.classList).toContain('form-control-warning');

        personInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(personInput.value).toBe('');
      });
    }));

    it('should save', fakeAsync(() => {
      const fixture = TestBed.createComponent(TaskEditComponent);
      fixture.detectChanges();

      tick();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        tick();

        const element = fixture.nativeElement;

        const title = element.querySelector('#title');
        title.value = 'test title';
        title.dispatchEvent(new Event('input'));

        const description = element.querySelector('#description');
        description.value = 'test description';
        description.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const saveButton = element.querySelector('#save');
        expect(saveButton.disabled).toBe(false);

        const dueDate = element.querySelector('#dueDate');
        dueDate.value = '2018-01-02';
        dueDate.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        tick();
        expect(fixture.componentInstance.task.dueDate).toEqual({year: 2018, month: 1, day: 2} as NgbDateStruct);

        checkPersonTypeaheadWorks(fixture, 'ced');
        fixture.nativeElement.querySelector('button.dropdown-item').click();

        const assignee: HTMLSelectElement = element.querySelector('#assignee');
        assignee.selectedIndex = 1;
        assignee.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        const taskService = TestBed.get(TaskService);
        const router = TestBed.get(Router);
        spyOn(taskService, 'create').and.returnValue(Observable.of({id: 42}));
        spyOn(router, 'navigate');

        saveButton.click();
        fixture.detectChanges();

        expect(taskService.create).toHaveBeenCalledWith({
          title: 'test title',
          description: 'test description',
          dueDate: '2018-01-02',
          concernedPersonId: 1,
          assigneeId: 3
        });
        expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
      });
    }));
  });

  describe('creation mode with concerned person', () => {

    beforeEach(() => {
      prepareModule(null, 1);
    });

    it('should have a prepopulated concerned person and redirect to the person task page after save', () => {
      const fixture = TestBed.createComponent(TaskEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const element = fixture.nativeElement;
        expect(fixture.componentInstance.task.concernedPerson).toEqual(persons[0]);
        expect(element.querySelector('#concernedPerson').value).toBe('Cedric Exbrayat (Hype)');
        expect(element.querySelector('#cancel').getAttribute('href')).toBe('/persons/1/tasks');

        const title = element.querySelector('#title');
        title.value = 'test title';
        title.dispatchEvent(new Event('input'));

        const description = element.querySelector('#description');
        description.value = 'test description';
        description.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const taskService = TestBed.get(TaskService);
        const router = TestBed.get(Router);
        spyOn(taskService, 'create').and.returnValue(Observable.of({id: 42}));
        spyOn(router, 'navigate');

        const saveButton = element.querySelector('#save');
        saveButton.click();
        fixture.detectChanges();

        expect(taskService.create).toHaveBeenCalledWith({
          title: 'test title',
          description: 'test description',
          dueDate: null,
          concernedPersonId: 1,
          assigneeId: null
        });
        expect(router.navigate).toHaveBeenCalledWith(['/persons', '1', 'tasks']);
      });
    });
  });

  describe('edition mode', () => {

    beforeEach(() => {
      const task = {
        id: 42,
        title: 'test title',
        description: 'test description',
        dueDate: '2018-01-02',
        concernedPerson: {id: 1} as PersonIdentityModel,
        assignee: {id: 3} as UserModel,
      } as TaskModel;

      prepareModule(task, null);
    });

    it('should have a title and a prepopulated form', () => {
      const fixture = TestBed.createComponent(TaskEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const element = fixture.nativeElement;
        expect(element.querySelector('h1').textContent).toContain('Modification de la tâche test title');

        expect(element.querySelector('input#title').value).toBe('test title');

        expect(element.querySelector('textarea#description').value).toBe('test description');

        expect(element.querySelector('input#dueDate').value).toBe('2018-01-02');
        expect(fixture.componentInstance.task.dueDate).toEqual({year: 2018, month: 1, day: 2} as NgbDateStruct);

        expect(element.querySelector('input#concernedPerson').value).toBe('Cedric Exbrayat (Hype)');
        expect(fixture.componentInstance.task.concernedPerson).toEqual(persons[0]);

        const assigneeSelect: HTMLSelectElement = element.querySelector('select#assignee');
        expect(assigneeSelect.selectedIndex).toBe(1);
        expect(fixture.componentInstance.task.assignee).toEqual(users[2]);

        expect(element.querySelector('#save').disabled).toBe(false);
      });
    });

    it('should save', () => {
      const fixture = TestBed.createComponent(TaskEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const element = fixture.nativeElement;

        const taskService = TestBed.get(TaskService);
        const router = TestBed.get(Router);
        spyOn(taskService, 'update').and.returnValue(Observable.of(null));
        spyOn(router, 'navigate');

        const saveButton = element.querySelector('#save');
        saveButton.click();
        fixture.detectChanges();

        expect(taskService.update).toHaveBeenCalledWith(42, {
          title: 'test title',
          description: 'test description',
          dueDate: '2018-01-02',
          concernedPersonId: 1,
          assigneeId: 3
        });
        expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
      });
    });
  });
});
