import { Component, OnInit } from '@angular/core';
import { NowService } from '../now.service';
import { ActivatedRoute } from '@angular/router';
import { sortBy } from '../utils';
import { TaskModel } from '../models/task.model';
import * as moment from 'moment';
import { TaskEvent } from '../tasks/tasks.component';
import { Observable } from 'rxjs/Observable';
import { TasksResolverService } from '../tasks-resolver.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'gl-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  tasks: Array<TaskModel>;

  constructor(private route: ActivatedRoute,
              private nowService: NowService,
              private taskService: TaskService,
              private tasksResolverService: TasksResolverService) { }

  ngOnInit() {
    this.tasks = this.sort(this.route.snapshot.data['tasks']);
  }

  onTaskClicked(event: TaskEvent) {
    switch (event.type) {
      case 'assign':
        this.handleEvent(this.taskService.assignToSelf(event.task.id));
        break;
      case 'markAsDone':
        this.handleEvent(this.taskService.markAsDone(event.task.id));
        break;
      case 'cancel':
        this.handleEvent(this.taskService.cancel(event.task.id));
        break;
      case 'resurrect':
        this.handleEvent(this.taskService.resurrect(event.task.id));
        break;
      case 'edit':
        throw new Error('not implemented yet');
    }
  }

  private sort(taskModels: Array<TaskModel>): Array<TaskModel> {
    const veryFarInTheFuture = this.nowService.now().add(1000, 'y');
    return sortBy<TaskModel>(
      taskModels,
        taskModel => taskModel.dueDate ? moment(taskModel.dueDate) : veryFarInTheFuture);
  }

  private handleEvent(action: Observable<void>) {
    action.switchMap(() => this.tasksResolverService.resolve(this.route.snapshot) as Observable<Array<TaskModel>>)
      .subscribe(taskModels => this.tasks = this.sort(taskModels), () => {});
  }
}
