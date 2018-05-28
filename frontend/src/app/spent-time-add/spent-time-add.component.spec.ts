import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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

@Component({
  template: `<gl-spent-time-add [taskModel]="task"
                                (cancelled)="onCancelled($event)"
                                (spentTimeAdded)="onSpentTimeAdded($event)"></gl-spent-time-add>`
})
class TestComponent {
  task = {
    id: 42
  } as TaskModel;

  cancelled = false;
  spentTimeAddedEvent: SpentTimeEvent;

  onCancelled(event: SpentTimeEvent) {
    this.cancelled = true;
  }

  onSpentTimeAdded(event: SpentTimeEvent) {
    this.spentTimeAddedEvent = event;
  }
}

describe('SpentTimeAddComponent', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpentTimeAddComponent, TestComponent],
      imports: [CurrentUserModule.forRoot(), HttpClientModule, ReactiveFormsModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  }));

  it('should have 0h0m as default inputs, and not allow to subit', () => {
    const inputs: Array<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
    expect(inputs[0].value).toBe('0');
    expect(inputs[1].value).toBe('0');
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('should cancel', () => {
    fixture.nativeElement.querySelectorAll('button')[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.cancelled).toBe(true);
  });

  it('should add', () => {
    const inputs: Array<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
    inputs[0].value = '1';
    inputs[0].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(addButton.disabled).toBe(false);

    inputs[1].value = '10';
    inputs[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const taskService = TestBed.get(TaskService);
    const spentTime = { id: 1 } as SpentTimeModel;
    spyOn(taskService, 'addSpentTime').and.returnValue(of(spentTime));

    addButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.spentTimeAddedEvent.task.id).toBe(42);
    expect(fixture.componentInstance.spentTimeAddedEvent.spentTime.id).toBe(1);
    expect(taskService.addSpentTime).toHaveBeenCalledWith(42, 70);
  });
});
