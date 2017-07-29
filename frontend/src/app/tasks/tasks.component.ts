import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskModel } from '../models/task.model';
import { sortBy } from '../utils';
import { UserModel } from '../models/user.model';
import * as moment from 'moment';

class Task {
  opened: boolean;

  constructor(public model: TaskModel) {}

  relativeDueDate(): string {
    const dueMoment = moment(this.model.dueDate);
    const today = moment().startOf('day');
    if (today.isSame(dueMoment)) {
      return 'Aujourd\'hui';
    }
    return today.to(dueMoment);
  }

  dueDateClass() {
    const dueMoment = moment(this.model.dueDate);
    const today = moment().startOf('day');
    const days = dueMoment.diff(today, 'days');
    if (days < 0) {
      return 'text-danger font-weight-bold';
    }
    if (days == 0) {
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
export class TasksComponent implements OnInit {

  tasks: Array<Task>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    const veryFarInTheFuture = moment().add(1000, 'y');
    this.tasks = sortBy<TaskModel>(this.route.snapshot.data['tasks'], task => task.dueDate ? moment(task.dueDate) : veryFarInTheFuture)
      .map(model => new Task(model));
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
