import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Task, TaskEvent, TasksComponent } from './tasks.component';
import { TaskModel } from '../models/task.model';
import { UserModel } from '../models/user.model';
import { PersonIdentityModel } from '../models/person.model';
import { FullnamePipe } from '../fullname.pipe';
import { DateTime } from 'luxon';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService } from '../task.service';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SpentTimesComponent } from '../spent-times/spent-times.component';
import { SpentTimeAddComponent } from '../spent-time-add/spent-time-add.component';
import { DurationPipe } from '../duration.pipe';
import { SpentTimeModel } from '../models/spent-time.model';
import { CurrentUserModule } from '../current-user/current-user.module';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

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
    jasmine.clock().mockDate(DateTime.fromISO('2017-08-01T12:30:00').toJSDate());

    tasks = [
      {
        id: 12,
        description: 'Some description',
        title: 'Some title',
        category: {
          id: 6,
          name: 'Various'
        },
        dueDate: '2017-08-01',
        status: 'TODO',
        totalSpentTimeInMinutes: 0,
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
    ] as Array<TaskModel>;

    TestBed.overrideTemplate(SpentTimeAddComponent, '');
    TestBed.overrideTemplate(SpentTimesComponent, '');

    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), RouterTestingModule, HttpClientModule, ReactiveFormsModule, GlobeNgbModule.forRoot()],
      declarations: [
        TestComponent,
        TasksComponent,
        FullnamePipe,
        SpentTimesComponent,
        SpentTimeAddComponent,
        DurationPipe,
      ]
    });
  }));

  afterEach(() => jasmine.clock().uninstall());

  describe('logic', () => {

    function createComponent() {
      const component = new TasksComponent();
      component.taskModels = tasks;
      return component;
    }

    it('should compute relative due date', () => {
      const model: TaskModel = tasks[0];
      model.dueDate = '2017-08-01';
      expect(new Task(model).relativeDueDate).toBe('aujourd\'hui');

      model.dueDate = '2017-08-02';
      expect(new Task(model).relativeDueDate).toBe('dans 1 jour');

      model.dueDate = '2017-08-04';
      expect(new Task(model).relativeDueDate).toBe('dans 3 jours');

      model.dueDate = '2017-07-31';
      expect(new Task(model).relativeDueDate).toBe('il y a 1 jour');

      model.dueDate = '2017-07-29';
      expect(new Task(model).relativeDueDate).toBe('il y a 3 jours');
    });

    it('should compute due date class', () => {
      const model: TaskModel = tasks[0];

      // due yesterday
      model.dueDate = '2017-07-31';
      expect(new Task(model).dueDateClass).toBe('text-danger font-weight-bold');

      // due today
      model.dueDate = '2017-08-01';
      expect(new Task(model).dueDateClass).toBe('text-danger');

      // due tomorrow
      model.dueDate = '2017-08-02';
      expect(new Task(model).dueDateClass).toBe('text-warning');

      // due in 6 days
      model.dueDate = '2017-08-07';
      expect(new Task(model).dueDateClass).toBe('text-warning');

      // due in more than 6 days
      model.dueDate = '2017-08-08';
      expect(new Task(model).dueDateClass).toBe('');
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

  describe('UI', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      fixture.componentInstance.tasks = tasks;
      fixture.detectChanges();
    });

    it('should display everything but the description and the no task message when not opened', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).not.toContain('Rien à faire');
      expect(text).toContain('Some title');
      expect(text).toContain('#Various');
      expect(text).toContain('aujourd\'hui');
      expect(text).not.toContain('Some description');
      expect(text).toContain('Assignée à admin');
      expect(text).toContain('Créée par user2');
      expect(text).toContain('Concerne JB Nizet');
      expect(text).toContain('0h00m');
    });

    it('should add a spent time, and close on cancel', () => {
      fixture.nativeElement.querySelector('a.add-spent-time-link').click();
      fixture.detectChanges();

      const spentTimeAddDebugElement = fixture.debugElement.query(By.directive(SpentTimeAddComponent));
      expect(spentTimeAddDebugElement).toBeTruthy();
      const spentTimeAddComponent: SpentTimeAddComponent = spentTimeAddDebugElement.componentInstance;
      spentTimeAddComponent.cancel();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(SpentTimeAddComponent))).toBeFalsy();
    });

    it('should add a spent time, recompute total spent time and close when added', () => {
      expect(fixture.nativeElement.querySelector('a.spent-times-link')).toBeFalsy();

      fixture.nativeElement.querySelector('a.add-spent-time-link').click();
      fixture.detectChanges();

      const spentTimeAddDebugElement = fixture.debugElement.query(By.directive(SpentTimeAddComponent));
      expect(spentTimeAddDebugElement).toBeTruthy();
      const spentTimeAddComponent: SpentTimeAddComponent = spentTimeAddDebugElement.componentInstance;
      spentTimeAddComponent.spentTimeAdded.emit({
        task: tasks[0],
        spentTime: {
          id: 1,
          minutes: 100
        } as SpentTimeModel
      });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(SpentTimeAddComponent))).toBeFalsy();
      const spentTimesLink = fixture.nativeElement.querySelector('a.spent-times-link');
      expect(spentTimesLink).toBeTruthy();
      expect(spentTimesLink.textContent).toContain('1h40m');
    });

    it('should display spent times and recompute total spent time when deleted', () => {
      tasks[0].totalSpentTimeInMinutes = 100;
      fixture.detectChanges();
      const spentTimesLink = fixture.nativeElement.querySelector('a.spent-times-link');
      expect(spentTimesLink).toBeTruthy();

      const taskService = TestBed.get(TaskService);
      spyOn(taskService, 'listSpentTimes').and.returnValue(of([]));

      fixture.nativeElement.querySelector('a.spent-times-link').click();
      fixture.detectChanges();

      const spentTimesDebugElement = fixture.debugElement.query(By.directive(SpentTimesComponent));
      expect(spentTimesDebugElement).toBeTruthy();
      const spentTimesComponent: SpentTimesComponent = spentTimesDebugElement.componentInstance;
      spentTimesComponent.spentTimeDeleted.emit({
        task: tasks[0],
        spentTime: {
          id: 1,
          minutes: 10
        } as SpentTimeModel
      });
      fixture.detectChanges();

      expect(spentTimesLink.textContent).toContain('1h30m');
      expect(fixture.debugElement.query(By.directive(SpentTimesComponent))).toBeFalsy();
    });

    it('should display status instead of due date when DONE', () => {
      tasks[0].status = 'DONE';
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

    it('should not crash when no due date, no assignee or no concerned person', () => {
      tasks[0].dueDate = null;
      tasks[0].assignee = null;
      tasks[0].concernedPerson = null;
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Some title');
    });

    it('should invoke actions', () => {
      fixture.nativeElement.querySelector('.edit-button').click();
      fixture.detectChanges();

      expect(fixture.componentInstance.event).toEqual({
        type: 'edit',
        task: tasks[0]
      });

      fixture.nativeElement.querySelector('.unassign-button').click();
      fixture.detectChanges();

      expect(fixture.componentInstance.event).toEqual({
        type: 'unassign',
        task: tasks[0]
      });

      tasks[0].assignee = null;
      fixture.detectChanges();

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

