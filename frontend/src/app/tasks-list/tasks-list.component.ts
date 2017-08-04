import { Component, OnInit } from '@angular/core';
import { NowService } from '../now.service';
import { ActivatedRoute } from '@angular/router';
import { sortBy } from '../utils';
import { TaskModel } from '../models/task.model';
import * as moment from 'moment';

@Component({
  selector: 'gl-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  tasks: Array<TaskModel>;

  constructor(private route: ActivatedRoute, private nowService: NowService) { }

  ngOnInit() {
    const veryFarInTheFuture = this.nowService.now().add(1000, 'y');
    this.tasks = sortBy<TaskModel>(this.route.snapshot.data['tasks'], task => task.dueDate ? moment(task.dueDate) : veryFarInTheFuture);
  }
}
