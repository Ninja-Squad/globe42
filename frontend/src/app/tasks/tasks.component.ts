import { Component, Input } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { UserModel } from '../models/user.model';
import * as moment from 'moment';
import { NowService } from '../now.service';

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

@Component({
  selector: 'gl-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  tasks: Array<Task> = [];

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

  assign(task: Task, event: Event) {
    task.model.assignee = { id: 1, login: 'admin' } as UserModel;
    event.stopPropagation();
    event.preventDefault();
  }
}
