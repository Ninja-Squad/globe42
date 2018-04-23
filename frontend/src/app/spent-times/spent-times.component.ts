import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../task.service';
import { SpentTimeModel } from '../models/spent-time.model';
import { SpentTimeEvent } from '../tasks/tasks.component';

@Component({
  selector: 'gl-spent-times',
  templateUrl: './spent-times.component.html',
  styleUrls: ['./spent-times.component.scss']
})
export class SpentTimesComponent implements OnInit {

  @Input()
  taskModel: TaskModel;

  @Output()
  readonly spentTimeDeleted = new EventEmitter<SpentTimeEvent>();

  spentTimes: Array<SpentTimeModel>;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.listSpentTimes(this.taskModel.id).subscribe(list => this.spentTimes = list);
  }

  delete(spentTime: SpentTimeModel, event: Event) {
    this.taskService.deleteSpentTime(this.taskModel.id, spentTime.id).subscribe(() => {
      this.spentTimes.splice(this.spentTimes.indexOf(spentTime), 1);
      this.spentTimeDeleted.emit({ task: this.taskModel, spentTime });
    });
    event.stopPropagation();
    event.preventDefault();
  }
}
