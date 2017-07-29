import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEvent, TasksComponent } from './tasks.component';
import { TaskModel } from '../models/task.model';
import { UserModel } from '../models/user.model';
import { PersonIdentityModel } from '../models/person.model';
import { FullnamePipe } from '../fullname.pipe';
import * as moment from 'moment';
import { NowService } from '../now.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { ConfirmService } from '../confirm.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { JwtInterceptorService } from '../jwt-interceptor.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: '<gl-tasks [taskModels]="tasks" (taskClicked)="onTaskClicked($event)"></gl-tasks>'
})
class TestComponent {
  tasks: Array<TaskModel> = [];
  event: TaskEvent;

  onTaskClicked(event: TaskEvent) {
    this.event = event;
  }
}

describe('TasksComponent', () => {
  let tasks: Array<TaskModel>;

  beforeEach(async(() => {
    tasks = [
      {
        id: 12,
        description: 'Some description',
        title: 'Some title',
        dueDate: '2017-08-01',
        status: 'TODO',
        assignee: {
          id: 1,
          login: 'admin'
        } as UserModel,
        creator: {
          id: 2,
          login: 'user2'
        } as UserModel,
        concernedPerson: {
          id: 3,
          firstName: 'JB',
          lastName: 'Nizet'
        } as PersonIdentityModel
      }
    ];

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, NgbModule.forRoot()],
      declarations: [TestComponent, TasksComponent, FullnamePipe],
      providers: [
        NowService,
        TaskService,
        TasksResolverService,
        ConfirmService,
        UserService,
        JwtInterceptorService
      ]
    });
    moment.locale('fr');

    spyOn(TestBed.get(NowService), 'now').and.callFake(() => moment('2017-08-01T12:30:00'));
  }));

  describe('logic', () => {

    function createComponent() {
      const component = new TasksComponent(TestBed.get(NowService));
      component.taskModels = tasks;
      return component;
    }

    it('should compute relative due date', () => {
      const component = createComponent();

      const task = component.tasks[0];
      task.model.dueDate = '2017-08-01';
      expect(task.relativeDueDate()).toBe('aujourd\'hui');

      task.model.dueDate = '2017-08-02';
      expect(task.relativeDueDate()).toBe('dans un jour');

      task.model.dueDate = '2017-07-31';
      expect(task.relativeDueDate()).toBe('il y a un jour');
    });

    it('should compute due date class', () => {
      const component = createComponent();
      component.taskModels = tasks;

      const task = component.tasks[0];
      // due yesterday
      task.model.dueDate = '2017-07-31';
      expect(task.dueDateClass()).toBe('text-danger font-weight-bold');

      // due today
      task.model.dueDate = '2017-08-01';
      expect(task.dueDateClass()).toBe('text-danger');

      // due tomorrow
      task.model.dueDate = '2017-08-02';
      expect(task.dueDateClass()).toBe('text-warning');

      // due in 6 days
      task.model.dueDate = '2017-08-07';
      expect(task.dueDateClass()).toBe('text-warning');

      // due in more than 6 days
      task.model.dueDate = '2017-08-08';
      expect(task.dueDateClass()).toBe('');
    });

    it('should toggle', () => {
      const component = createComponent();
      component.taskModels = tasks;

      const task = component.tasks[0];
      component.toggle(task, new Event('click'));
      expect(task.opened).toBe(true);

      component.toggle(task, new Event('click'));
      expect(task.opened).toBe(false);
    });
  });

  describe('ui', () => {
    let fixture: ComponentFixture<TestComponent>;
    let tasksComponent: TasksComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      fixture.componentInstance.tasks = tasks;
      tasksComponent = fixture.debugElement.query(By.directive(TasksComponent)).componentInstance;
      fixture.detectChanges();
    });

    it('should display everything but the description and the no task message when not opened', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).not.toContain('Rien à faire');
      expect(text).toContain('Some title');
      expect(text).toContain('aujourd\'hui');
      expect(text).not.toContain('Some description');
      expect(text).toContain('Assignée à admin');
      expect(text).toContain('Créée par user2');
      expect(text).toContain('Concerne JB Nizet');
    });

    it('should display status instead of due date when DONE', () => {
      tasks[0].status = 'DONE'
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Faite');
      expect(text).not.toContain('aujourd\'hui');
    });

    it('should display status instead of due date when CANCELLED', () => {
      tasks[0].status = 'CANCELLED';
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Annulée');
      expect(text).not.toContain('aujourd\'hui');
    });

    it('should display the description when opened', () => {
      fixture.nativeElement.querySelector('.task-title').click();
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;

      expect(text).toContain('Some description');
    });

    it('should not crash when no due date, no assignee, no creator or no concerned person', () => {
      tasks[0].dueDate = null;
      tasks[0].assignee = null;
      tasks[0].creator = null;
      tasks[0].concernedPerson = null;
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Some title');
    });

    it('should display a message when no task', () => {
      fixture.componentInstance.tasks = [];
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Rien à faire');
      expect(fixture.nativeElement.querySelectorAll('.task-item').length).toBe(0);
    });

    it('should invoke actions', () => {
      fixture.nativeElement.querySelector('.edit-button').click();
      fixture.detectChanges();

      expect(fixture.componentInstance.event).toEqual({
        type: 'edit',
        task: tasks[0]
      });

      fixture.nativeElement.querySelector('.assign-button').click();
      fixture.detectChanges();

      expect(fixture.componentInstance.event).toEqual({
        type: 'assign',
        task: tasks[0]
      });

      fixture.nativeElement.querySelector('.cancel-button').click();
      fixture.detectChanges();
      expect(fixture.componentInstance.event).toEqual({
        type: 'cancel',
        task: tasks[0]
      });

      fixture.nativeElement.querySelector('.done-button').click();
      fixture.detectChanges();
      expect(fixture.componentInstance.event).toEqual({
        type: 'markAsDone',
        task: tasks[0]
      });

      tasks[0].status = 'DONE';
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.resurrect-button').click();
      fixture.detectChanges();
      expect(fixture.componentInstance.event).toEqual({
        type: 'resurrect',
        task: tasks[0]
      });
    });
  });
});

