import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { DateTime } from 'luxon';
import { SpentTimeModel } from '../models/spent-time.model';

class Task {
  opened = false;
  spentTimesOpened = false;
  addSpentTimeOpened = false;

  constructor(public model: TaskModel) {}

  relativeDueDate(): string {
    const dueDateTime = DateTime.fromISO(this.model.dueDate);
    const today = DateTime.local().startOf('day');
    if (today.equals(dueDateTime)) {
      return 'aujourd\'hui';
    }
    const days = dueDateTime.diff(today, ['days']).days;
    if (days === 0) {
      return 'aujourd\'hui';
    }
    if (days > 0) {
      return `dans ${days} jour${days > 1 ? 's' : ''}`;
    }
    const d = Math.abs(days);
    return `il y a ${d} jour${d > 1 ? 's' : ''}`;
  }

  dueDateClass() {
    const dueDateTime = DateTime.fromISO(this.model.dueDate);
    const today = DateTime.local().startOf('day');
    const days = dueDateTime.diff(today, ['days']).days;
    if (days < 0) {
      return 'text-danger font-weight-bold';
    }
    if (days === 0) {
      return 'text-danger';
    }
    if (days > 0 && days < 7) {
      return 'text-warning';
    }
    return '';
  }
}

export type TaskEventType = 'edit' | 'assign' | 'markAsDone' | 'cancel' | 'resurrect' | 'unassign';

export interface TaskEvent {
  task: TaskModel;
  type: TaskEventType;
}

export interface SpentTimeEvent {
  task: TaskModel;
  spentTime: SpentTimeModel;
}

@Component({
  selector: 'gl-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  tasks: Array<Task> = [];

  @Output()
  taskClicked = new EventEmitter<TaskEvent>();

  @Input()
  set taskModels(models: Array<TaskModel>) {
    this.tasks = models.map(model => new Task(model));
  }

  toggle(task: Task, event: Event) {
    task.opened = !task.opened;
    event.stopPropagation();
    event.preventDefault();
  }

  edit(task: Task, event: Event) {
    this.handleEvent('edit', task, event);
  }

  assign(task: Task, event: Event) {
    this.handleEvent('assign', task, event);
  }

  markAsDone(task: Task, event: Event) {
    this.handleEvent('markAsDone', task, event);
  }

  cancel(task: Task, event: Event) {
    this.handleEvent('cancel', task, event);
  }

  resurrect(task: Task, event: Event) {
    this.handleEvent('resurrect', task, event);
  }

  unassign(task: Task, event: Event) {
    this.handleEvent('unassign', task, event);
  }

  toggleSpentTimes(task: Task, event: Event) {
    task.spentTimesOpened = !task.spentTimesOpened;
    if (task.spentTimesOpened) {
      task.addSpentTimeOpened = false;
    }
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  toggleAddSpentTime(task: Task, event: Event) {
    task.addSpentTimeOpened = !task.addSpentTimeOpened;
    if (task.addSpentTimeOpened) {
      task.spentTimesOpened = false;
    }
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onSpentTimeDeleted(event: SpentTimeEvent) {
    // we could reload the task, or even ask the parent to reload the whole list,
    // but it's faster and simpler to just update the total spent time of the task, and
    // to hide the details
    event.task.totalSpentTimeInMinutes -= event.spentTime.minutes;
    this.tasks.find(task => task.model.id === event.task.id).spentTimesOpened = false;
  }

  onSpentTimeAdded(event: SpentTimeEvent) {
    // we could reload the task, or even ask the parent to reload the whole list,
    // but it's faster and simpler to just update the total spent time of the task, and
    // to hide the add form
    event.task.totalSpentTimeInMinutes += event.spentTime.minutes;
    this.tasks.find(task => task.model.id === event.task.id).addSpentTimeOpened = false;
  }

  private handleEvent(type: TaskEventType, task: Task, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.taskClicked.emit({type, task: task.model});
  }
}
