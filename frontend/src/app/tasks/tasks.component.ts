import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskModel } from '../models/task.model';
import * as moment from 'moment';
import { NowService } from '../now.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { TaskService } from '../task.service';
import { ConfirmService } from '../confirm.service';
import 'rxjs/add/operator/switchMap';

class Task {
  opened: boolean;

  constructor(public model: TaskModel, private nowService: NowService) {}

  relativeDueDate(): string {
    const dueMoment = moment(this.model.dueDate);
    const today = this.nowService.now().startOf('day');
    if (today.isSame(dueMoment)) {
      return 'aujourd\'hui';
    }
    return today.to(dueMoment);
  }

  dueDateClass() {
    const dueMoment = moment(this.model.dueDate);
    const today = this.nowService.now().startOf('day');
    const days = dueMoment.diff(today, 'days');
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

export type TaskEventType = 'edit' | 'assign' | 'markAsDone' | 'cancel' | 'resurrect';

export interface TaskEvent {
  task: TaskModel;
  type: TaskEventType;
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

  constructor(private nowService: NowService) { }

  @Input()
  set taskModels(models: Array<TaskModel>) {
    this.tasks = models.map(model => new Task(model, this.nowService))
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

  private handleEvent(type: TaskEventType, task: Task, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.taskClicked.emit({type, task: task.model});
  }
}
