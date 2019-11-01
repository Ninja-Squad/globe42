import { async, TestBed } from '@angular/core/testing';

import { SpentTimeAddComponent } from './spent-time-add.component';
import { Component } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { SpentTimeEvent } from '../tasks/tasks.component';
import { TaskService } from '../task.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SpentTimeModel } from '../models/spent-time.model';
import { CurrentUserModule } from '../current-user/current-user.module';
import { of } from 'rxjs';
import { ComponentTester, speculoosMatchers, TestButton, TestInput } from 'ngx-speculoos';

@Component({
  template: `<gl-spent-time-add [taskModel]="task"
                                (cancelled)="onCancelled()"
                                (spentTimeAdded)="onSpentTimeAdded($event)"></gl-spent-time-add>`
})
class TestComponent {
  task = {
    id: 42
  } as TaskModel;

  cancelled = false;
  spentTimeAddedEvent: SpentTimeEvent;

  onCancelled() {
    this.cancelled = true;
  }

  onSpentTimeAdded(event: SpentTimeEvent) {
    this.spentTimeAddedEvent = event;
  }
}

class SpentTimeAddComponentTester extends ComponentTester<TestComponent> {

  constructor() {
    super(TestComponent);
  }

  get hours() {
    return this.elements('input')[0] as TestInput;
  }

  get minutes() {
    return this.elements('input')[1] as TestInput;
  }

  get add() {
    return this.button('button');
  }

  get cancel() {
    return this.elements('button')[1] as TestButton;
  }
}

describe('SpentTimeAddComponent', () => {
  let tester: SpentTimeAddComponentTester;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpentTimeAddComponent, TestComponent],
      imports: [CurrentUserModule.forRoot(), HttpClientModule, ReactiveFormsModule]
    });

    tester = new SpentTimeAddComponentTester();
    tester.detectChanges();

    jasmine.addMatchers(speculoosMatchers);
  }));

  it('should have 0h0m as default inputs, and not allow to subit', () => {
    expect(tester.hours).toHaveValue('0');
    expect(tester.minutes).toHaveValue('0');
    expect(tester.add.disabled).toBe(true);
  });

  it('should cancel', () => {
    tester.cancel.click();
    expect(tester.componentInstance.cancelled).toBe(true);
  });

  it('should add', () => {
    tester.hours.fillWith('1');

    expect(tester.add.disabled).toBe(false);

    tester.minutes.fillWith('10');

    const taskService = TestBed.inject(TaskService);
    const spentTime = { id: 1 } as SpentTimeModel;
    spyOn(taskService, 'addSpentTime').and.returnValue(of(spentTime));

    tester.add.click();

    const spentTimeAddedEvent = tester.componentInstance.spentTimeAddedEvent;
    expect(spentTimeAddedEvent.task.id).toBe(42);
    expect(spentTimeAddedEvent.spentTime.id).toBe(1);
    expect(taskService.addSpentTime).toHaveBeenCalledWith(42, 70);
  });
});
