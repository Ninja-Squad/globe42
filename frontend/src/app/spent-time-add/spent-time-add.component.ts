import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../task.service';
import { SpentTimeEvent } from '../tasks/tasks.component';

@Component({
  selector: 'gl-spent-time-add',
  templateUrl: './spent-time-add.component.html',
  styleUrls: ['./spent-time-add.component.scss']
})
export class SpentTimeAddComponent {

  @Input() taskModel: TaskModel;

  @Output() spentTimeAdded = new EventEmitter<SpentTimeEvent>();
  @Output() cancelled = new EventEmitter<void>();

  model = {
    hours: 0,
    minutes: 0
  };

  constructor(private taskService: TaskService) { }

  isAddable() {
    return this.model.hours > 0 || this.model.minutes > 0;
  }

  add() {
    const minutes = this.model.minutes + this.model.hours * 60;
    this.taskService.addSpentTime(this.taskModel.id, minutes).subscribe(spentTime => {
      this.spentTimeAdded.emit({ task: this.taskModel, spentTime });
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}
