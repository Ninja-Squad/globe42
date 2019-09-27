import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpentTimesComponent } from './spent-times.component';
import { Component, LOCALE_ID } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { SpentTimeEvent } from '../tasks/tasks.component';
import { TaskService } from '../task.service';
import { SpentTimeModel } from '../models/spent-time.model';
import { Subject, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DurationPipe } from '../duration.pipe';
import { CurrentUserModule } from '../current-user/current-user.module';
import Spy = jasmine.Spy;

@Component({
  template: `<gl-spent-times [taskModel]="taskModel" (spentTimeDeleted)="storeDeletedSpentTime($event)"></gl-spent-times>`
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

describe('SpentTimesComponent', () => {
  describe('logic', () => {
    it('should list spent times', () => {
      const taskService: TaskService = jasmine.createSpyObj(['listSpentTimes']);
      const task = {
        id: 42
      } as TaskModel;

      const spentTimes = [
        {
          id: 1
        }
      ] as Array<SpentTimeModel>;
      (taskService.listSpentTimes as Spy).and.returnValue(of(spentTimes));

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
          id: 1,
        },
        {
          id: 2,
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
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SpentTimesComponent, TestComponent, DurationPipe],
        providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
        imports: [CurrentUserModule.forRoot(), HttpClientModule]
      });

      const taskService = TestBed.get(TaskService);
      spyOn(taskService, 'listSpentTimes').and.returnValue(of([
        {
          id: 2,
          minutes: 12,
          creator: { login: 'Ced' },
          creationInstant: '2018-11-03T14:13:00.000Z'
        },
        {
          id: 1,
          minutes: 100,
          creator: { login: 'JB' },
          creationInstant: '2018-11-03T12:13:00.000Z'
        }
      ]));

      spyOn(taskService, 'deleteSpentTime').and.returnValue(of(null));

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    }));

    it('should list spent times', () => {
      const itemElements = fixture.nativeElement.querySelectorAll('li');
      expect(itemElements.length).toBe(2);

      // avoid using contains because the exact value depends on the browser timezone
      expect(itemElements[0].textContent).toMatch(/\d nov. 2018 à \d\d:13:00: 0h12m/);
      expect(itemElements[0].textContent).toContain('par Ced');
      expect(itemElements[1].textContent).toMatch(/\d nov. 2018 à \d\d:13:00: 1h40m/);
      expect(itemElements[1].textContent).toContain('par JB');
    });

    it('should delete', () => {
      const deleteLink: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
      deleteLink.click();
      fixture.detectChanges();

      const itemElements = fixture.nativeElement.querySelectorAll('li');
      expect(itemElements.length).toBe(1);
      expect(fixture.componentInstance.deletedSpentTimeEvent.spentTime.id).toBe(2);
    });
  });
});
