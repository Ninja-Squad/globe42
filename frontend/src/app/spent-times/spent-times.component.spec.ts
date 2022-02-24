import { TestBed } from '@angular/core/testing';

import { SpentTimesComponent } from './spent-times.component';
import { Component, LOCALE_ID } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { SpentTimeEvent } from '../tasks/tasks.component';
import { TaskService } from '../task.service';
import { SpentTimeModel } from '../models/spent-time.model';
import { of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DurationPipe } from '../duration.pipe';
import { CurrentUserModule } from '../current-user/current-user.module';
import { ComponentTester, createMock } from 'ngx-speculoos';
import { DateTime } from 'luxon';
import Spy = jasmine.Spy;

@Component({
  template: `
    <gl-spent-times
      [taskModel]="taskModel"
      (spentTimeDeleted)="storeDeletedSpentTime($event)"
    ></gl-spent-times>
  `
})
class TestComponent {
  taskModel = {
    id: 42
  } as TaskModel;

  deletedSpentTimeEvent: SpentTimeEvent;

  storeDeletedSpentTime(event: SpentTimeEvent) {
    this.deletedSpentTimeEvent = event;
  }
}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get spentTimeItems() {
    return this.elements('li');
  }

  get deleteLinks() {
    return this.elements('a');
  }
}

describe('SpentTimesComponent', () => {
  describe('logic', () => {
    it('should list spent times', () => {
      const taskService = createMock(TaskService);
      const task = {
        id: 42
      } as TaskModel;

      const spentTimes = [
        {
          id: 1
        }
      ] as Array<SpentTimeModel>;
      taskService.listSpentTimes.and.returnValue(of(spentTimes));

      const component = new SpentTimesComponent(taskService);
      component.taskModel = task;
      component.ngOnInit();

      expect(component.spentTimes).toEqual(spentTimes);
      expect(taskService.listSpentTimes).toHaveBeenCalledWith(task.id);
    });

    it('should delete spent time', () => {
      const taskService: TaskService = jasmine.createSpyObj(['deleteSpentTime']);
      const task = {
        id: 42
      } as TaskModel;

      const component = new SpentTimesComponent(taskService);
      component.spentTimes = [
        {
          id: 1
        },
        {
          id: 2
        }
      ] as Array<SpentTimeModel>;

      component.taskModel = task;

      const deletionResult = new Subject<void>();
      (taskService.deleteSpentTime as Spy).and.returnValue(deletionResult);

      spyOn(component.spentTimeDeleted, 'emit');
      const event = new Event('click');
      component.delete(component.spentTimes[0], event);

      deletionResult.next(null);

      expect(component.spentTimes).toEqual([{ id: 2 }] as Array<SpentTimeModel>);
      expect(component.spentTimeDeleted.emit).toHaveBeenCalledWith({
        task,
        spentTime: { id: 1 } as SpentTimeModel
      });
    });
  });

  describe('UI', () => {
    let tester: TestComponentTester;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SpentTimesComponent, TestComponent, DurationPipe],
        providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
        imports: [CurrentUserModule.forRoot(), HttpClientModule]
      });

      const taskService = TestBed.inject(TaskService);
      spyOn(taskService, 'listSpentTimes').and.returnValue(
        of([
          {
            id: 2,
            minutes: 12,
            creator: { login: 'Ced' },
            creationInstant: DateTime.local(2018, 11, 3, 14, 13).setZone('UTC').toISO()
          } as SpentTimeModel,
          {
            id: 1,
            minutes: 100,
            creator: { login: 'JB' },
            creationInstant: DateTime.local(2018, 11, 3, 12, 13).setZone('UTC').toISO()
          } as SpentTimeModel
        ])
      );

      spyOn(taskService, 'deleteSpentTime').and.returnValue(of(null));

      tester = new TestComponentTester();
      tester.detectChanges();
    });

    it('should list spent times', () => {
      expect(tester.spentTimeItems.length).toBe(2);

      // avoid using contains because the exact value depends on the browser timezone
      expect(tester.spentTimeItems[0]).toContainText('3 nov. 2018, 14:13:00: 0h12m');
      expect(tester.spentTimeItems[0]).toContainText('par Ced');
      expect(tester.spentTimeItems[1]).toContainText('3 nov. 2018, 12:13:00: 1h40m');
      expect(tester.spentTimeItems[1]).toContainText('par JB');
    });

    it('should delete', () => {
      tester.deleteLinks[0].click();

      expect(tester.spentTimeItems.length).toBe(1);
      expect(tester.componentInstance.deletedSpentTimeEvent.spentTime.id).toBe(2);
    });
  });
});
